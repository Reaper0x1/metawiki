# Authentik <img src="/authentik-icon2.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Authentik is an open-source Identity Provider that emphasizes flexibility and versatility.

::: info
The guide refers to the domain <strong>example.com</strong> and the local IP <strong>192.168.1.100</strong>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check this guide.

Create the following docker-compose.yml:
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

::: warning
* If you want to change port make sure to change only the left one (<span style="color:orange"><strong>9000</strong></span>:9000).
:::

## Create .env file
```yml
sudo apt-get install -y pwgen
```
```yml
echo "PG_PASS=$(pwgen -s 40 1)" >> .env

```
```yml
echo "AUTHENTIK_SECRET_KEY=$(pwgen -s 50 1)" >> .env
```

Skip this if you don't want to enable error reporting.

```yml
echo "AUTHENTIK_ERROR_REPORTING__ENABLED=true" >> .env
```

::: warning
If you changed the default ports, you need to add the following variables to the .env file:
```yml
echo "AUTHENTIK_PORT_HTTP=9090" >> .env
echo "AUTHENTIK_PORT_HTTPS=9443" >> .env
```
:::

## Run the container

For version of Docker Compose ≥ 2 use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

## First login
Go to authentik web interface using <strong>ht<span>tps://</span>192.168.1.100:9443/if/flow/initial-setup/</strong> and create a new user.

## Add Authentik to Nginx Proxy Manager

Add authentik to Nginx Proxy Manager referring to [this guide](./nginx-proxy-manager#add-new-host).

## Create Provider
Select <strong>Providers</strong> under <strong>Application</strong> tab on left hand side. Create new <strong>Proxy Provider</strong>:
* Name: <strong>Your apps name</strong>
* Authentication flow: <strong>default-authentication-flow</strong> 
* Authorization flow: <strong>Authorize Application IMPLICIT content</strong>
* Type: <strong>Forward auth (single application)</strong>
* External Host: your app address <strong>ht<span>tps://</span>app.example.com/</strong>

Click Finish.

## Create Application
Select <strong>Applications</strong> from left side and create new application.

Choose a name for you application (app).

::: warning
Make sure you select the provider previously created.
:::

Click Create.

## Modify Outpost
Select <strong>Outpost</strong> from the left menu and select the edit button.

Select you application under <strong>Application</strong> tab. if you have multiple applications, you need to hold your control button and select all. Otherwise redirection wont work. 

Once done update.

## Add Proxy Pass in Nginx Proxy Manager
Login to the NPM server, edit the application proxy entry and select <strong>Advanced</strong> tab.

Paste the code below:
```text
# Increase buffer size for large headers
# This is needed only if you get 'upstream sent too big header while reading response
# header from upstream' error when trying to access an application protected by goauthentik
proxy_buffers 8 16k;
proxy_buffer_size 32k;

location / {
    # Put your proxy_pass to your application here
    proxy_pass          $forward_scheme://$server:$port;

    # authentik-specific config
    auth_request        /outpost.goauthentik.io/auth/nginx;
    error_page          401 = @goauthentik_proxy_signin;
    auth_request_set $auth_cookie $upstream_http_set_cookie;
    add_header Set-Cookie $auth_cookie;

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
    proxy_pass          http://auth.example.com/outpost.goauthentik.io;
    # ensure the host of this vserver matches your external URL you've configured
    # in authentik
    proxy_set_header    Host $host;
    proxy_set_header    X-Original-URL $scheme://$http_host$request_uri;
    add_header          Set-Cookie $auth_cookie;
    auth_request_set    $auth_cookie $upstream_http_set_cookie;

    # required for POST requests to work
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
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
* proxy_pass <strong>ht<span>tps://</span>auth.example.com/outpost.goauthentik.io</strong>
* proxy_pass <strong>ht<span>tps://</span>192.168.1.100:9443/outpost.goauthentik.io</strong>
:::

Now you can test your authentication by navigate to <strong>ht<span>tps://</span>app.example.com</strong> (If you are authenticated in Authentik you must log out to test the system).

## Common issues
1. <strong>Getting 500 error after installation</strong>.
<br/>
    Common cause is Authentik instance is not reachable from NPM installation, You need to make sure both instance have reachability.
    Try to change the Authentik instance address to IP address or hostname with relevant port number.