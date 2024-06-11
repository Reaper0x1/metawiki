# <img src="/authentik-icon2.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Authentik <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Authentik is an open-source Identity Provider that emphasizes flexibility and versatility.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "3.4"

services:
  postgresql:
    image: docker.io/library/postgres:12-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 5s
    volumes:
      - database:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${PG_PASS:?database password required}
      POSTGRES_USER: ${PG_USER:-authentik}
      POSTGRES_DB: ${PG_DB:-authentik}
    env_file:
      - .env
  redis:
    image: docker.io/library/redis:alpine
    command: --save 60 1 --loglevel warning
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping | grep PONG"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 3s
    volumes:
      - redis:/data
  server:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2023.10.4}
    restart: unless-stopped
    command: server
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    volumes:
      - ./media:/media
      - ./custom-templates:/templates
    env_file:
      - .env
    ports:
      - "${COMPOSE_PORT_HTTP:-9000}:9000"
      - "${COMPOSE_PORT_HTTPS:-9443}:9443"
    depends_on:
      - postgresql
      - redis
  worker:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2023.10.4}
    restart: unless-stopped
    command: worker
    environment:
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    # `user: root` and the docker socket volume are optional.
    # See more for the docker socket integration here:
    # https://goauthentik.io/docs/outposts/integrations/docker
    # Removing `user: root` also prevents the worker from fixing the permissions
    # on the mounted folders, so when removing this make sure the folders have the correct UID/GID
    # (1000:1000 by default)
    user: root
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./media:/media
      - ./certs:/certs
      - ./custom-templates:/templates
    env_file:
      - .env
    depends_on:
      - postgresql
      - redis

volumes:
  database:
    driver: local
  redis:
    driver: local
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>9000</strong></span>:9000).
* Change the <code>volumes</code> mappings to your preferences.
:::

## Create .env file
```bash
sudo apt-get install -y pwgen
```
```bash
echo "PG_PASS=$(pwgen -s 40 1)" >> .env

```
```bash
echo "AUTHENTIK_SECRET_KEY=$(pwgen -s 50 1)" >> .env
```

Skip this if you don't want to enable error reporting.

```bash
echo "AUTHENTIK_ERROR_REPORTING__ENABLED=true" >> .env
```

::: warning
If you changed the default ports, you need to add the following variables to the .env file:
```bash
echo "AUTHENTIK_PORT_HTTP=9090" >> .env
```
```bash
echo "AUTHENTIK_PORT_HTTPS=9443" >> .env
```
:::

## Run the container

For version of Docker Compose <code>≥ 2</code> use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

## First login
Go to authentik web interface using <code>ht<span>tps://</span>192.168.1.100:9443/if/flow/initial-setup/</code> and create a new user.

## Add Authentik to Nginx Proxy Manager

Add authentik to Nginx Proxy Manager referring to [this guide](./nginx-proxy-manager#add-new-host).

## Create Provider
1. Select <strong>Providers</strong> under <strong>Application</strong> tab on left hand side. Create new <strong>Proxy Provider</strong>:
    * Name: <code>Your apps name</code>
    * Authentication flow: <code>default-authentication-flow</code> 
    * Authorization flow: <code>Authorize Application IMPLICIT content</code>
    * Type: <code>Forward auth (single application)</code>
    * External Host: your app address <code>ht<span>tps://</span>app.example.com/</code>

2. Click Finish.

## Create Application
1. Select <strong>Applications</strong> from left side and create new application.

2. Choose a name for you application (app).

    ::: warning
    Make sure you select the provider previously created.
    :::

3. Click Create.

## Modify Outpost
1. Select <strong>Outpost</strong> from the left menu and select the edit button.

2. Select you application under <strong>Application</strong> tab. if you have multiple applications, you need to hold your control button and select all. Otherwise redirection wont work. 

3. Make sure the configuration on the bottom to set <code>authentik_host</code> to match your external domain (if configured).
    ```yaml
    authentik_host: https://auth.example.com
    ```

4. Once done update.

## Add Proxy Pass in Nginx Proxy Manager
1. Login to the NPM server, edit the application proxy entry and select <strong>Advanced</strong> tab.

2. Paste the code below:
    ```text
    # Increase buffer size for large headers
    # This is needed only if you get 'upstream sent too big header while reading response
    # header from upstream' error when trying to access an application protected by goauthentik
    proxy_buffers 8 16k;
    proxy_buffer_size 32k;

    # Make sure not to redirect traffic to a port 4443
    port_in_redirect off;

    location / {
        # Put your proxy_pass to your application here
        proxy_pass          $forward_scheme://$server:$port;
        # Set any other headers your application might need
        # proxy_set_header Host $host;
        # proxy_set_header ...

        ##############################
        # authentik-specific config
        ##############################
        auth_request     /outpost.goauthentik.io/auth/nginx;
        error_page       401 = @goauthentik_proxy_signin;
        auth_request_set $auth_cookie $upstream_http_set_cookie;
        add_header       Set-Cookie $auth_cookie;

        # translate headers from the outposts back to the actual upstream
        auth_request_set $authentik_username $upstream_http_x_authentik_username;
        auth_request_set $authentik_groups $upstream_http_x_authentik_groups;
        auth_request_set $authentik_email $upstream_http_x_authentik_email;
        auth_request_set $authentik_name $upstream_http_x_authentik_name;
        auth_request_set $authentik_uid $upstream_http_x_authentik_uid;

        proxy_set_header X-authentik-username $authentik_username;
        proxy_set_header X-authentik-groups $authentik_groups;
        proxy_set_header X-authentik-email $authentik_email;
        proxy_set_header X-authentik-name $authentik_name;
        proxy_set_header X-authentik-uid $authentik_uid;
    }

    # all requests to /outpost.goauthentik.io must be accessible without authentication
    location /outpost.goauthentik.io {
        proxy_pass              https://192.168.1.100:9443/outpost.goauthentik.io;
        # ensure the host of this vserver matches your external URL you've configured
        # in authentik
        proxy_set_header        Host $host;
        proxy_set_header        X-Original-URL $scheme://$http_host$request_uri;
        add_header              Set-Cookie $auth_cookie;
        auth_request_set        $auth_cookie $upstream_http_set_cookie;
        proxy_pass_request_body off;
        proxy_set_header        Content-Length "";
    }

    # Special location for when the /auth endpoint returns a 401,
    # redirect to the /start URL which initiates SSO
    location @goauthentik_proxy_signin {
        internal;
        add_header Set-Cookie $auth_cookie;
        return 302 /outpost.goauthentik.io/start?rd=$request_uri;
        # For domain level, use the below error_page to redirect to your authentik server with the full redirect path
        # return 302 https://authentik.company/outpost.goauthentik.io/start?rd=$scheme://$http_host$request_uri;
    }
    ```

    ::: warning
    Make sure you have changed the authentik proxy pass config. Either you can use internal IP address with port number or public address:
    * proxy_pass <code>ht<span>tps://</span>auth.example.com/outpost.goauthentik.io</code>
    * proxy_pass <code>ht<span>tps://</span>192.168.1.100:9443/outpost.goauthentik.io</code>
    :::

3. Now you can test your authentication by navigate to <code>ht<span>tps://</span>app.example.com</code> (If you are authenticated in Authentik you must log out to test the system).

## Common Issues
1. <strong>Getting 500 error after installation</strong>.
<br/>
    Common cause is Authentik instance is not reachable from NPM installation, You need to make sure both instance have reachability.
    Try to change the Authentik instance address to IP address or hostname with relevant port number.

## Customization
You can customize the look of the login page.

### Change Background and Layout
1. Go to <strong>Flows and Stages</strong> and then <strong>Flows</strong>.
Select "<strong>default-authentication-flow</strong>" and click edit.
    * <strong>Name</strong> / <strong>Title</strong>: set to whatever you want.

2. Open the Appearance settings:
    * <strong>Layout</strong>: the style of the login form and background. See 
  <a href="https://goauthentik.io/docs/flow/layouts" target="_blank" rel="noreferrer">here</a> for more info.
    * <strong>Background</strong>: select your custom background image.

3. Click Update to save your changes.

### Change Branding Settings
1. Go to <strong>System</strong> and then <strong>Tenants</strong>.

2. Click the edit button for the domain <code>authentik-default</code>.

    Here you can change:
    * <strong>Title</strong>
    * <strong>Logo</strong>
    * <strong>Favicon</strong>

    You can upload logo and favicon assets to the <code>media</code> folder inside your mapping of the [docker compose file](./authentik#docker-compose). I suggest to create a new directory called <code>logos</code> and place the assets inside. Next you can easily reference them using the path <code>/media/logos/logo.png</code>.

3. Click Update to save your changes.