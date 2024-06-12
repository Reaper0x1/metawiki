# <img src="/outline-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Outline <Badge type="tip" text="docker" style=" position: relative; float: right;" />


A modern team knowledge base for your internal documentation, product specs, support answers, meeting notes, onboarding, and more.

- A blazing fast editor with markdown support, slash commands, interactive embeds.
- Collaborate with team mates on documents in realtime. Comments & threads keep conversations organized.
- Search across your workspace instantly, and ask questions about your documents to get direct AI answers.
- Share documents publicly with a link, or privately with a team. Use your own brand colors, logos, and domain.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

:::warning
It is reccommended to use cli docker compose commands instead of managing the container with some manager like Portainer.
:::

1. Create the following <code>docker-compose.yml</code>:
    ```yml{8,46,66}
    version: "3.2"
    services:

    outline:
        image: docker.getoutline.com/outlinewiki/outline:0.75.2
        env_file: ./docker.env
        ports:
        - "3000:3000"
        restart: unless-stopped
        volumes:
        - storage-data:/var/lib/outline/data
        depends_on:
        - postgres
        - redis

    redis:
        image: redis
        env_file: ./docker.env
        ports:
        - "6379:6379"
        restart: unless-stopped
    #    volumes:
    #      - ./redis.conf:/redis.conf
        command: ["redis-server", "/redis.conf"]
        healthcheck:
        test: ["CMD", "redis-cli", "ping"]
        interval: 10s
        timeout: 30s
        retries: 3

    postgres:
        image: postgres
        env_file: ./docker.env
        ports:
        - "5432:5432"
        restart: unless-stopped
        volumes:
        - database-data:/var/lib/postgresql/data
        healthcheck:
        test: ["CMD", "pg_isready -d outline -U user"]
        interval: 30s
        timeout: 20s
        retries: 3
        environment:
        POSTGRES_USER: 'user'
        POSTGRES_PASSWORD: 'SECURE_PASSWORD'
        POSTGRES_DB: 'outline'

    https-portal:
        image: steveltn/https-portal
        env_file: ./docker.env
        ports:
        - '80:80'
        - '443:443'
        links:
        - outline
        restart: unless-stopped
        volumes:
        - https-portal-data:/var/lib/https-portal
        healthcheck:
        test: ["CMD", "service", "nginx", "status"]
        interval: 30s
        timeout: 20s
        retries: 3
        environment:
        DOMAINS: 'outline.excample.com -> http://outline:3000'
        STAGE: 'production'
        WEBSOCKET: 'true'
        CLIENT_MAX_BODY_SIZE: '0'

    volumes:
    https-portal-data:
    storage-data:
    database-data:
    ```

    ::: info
    * If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>3000</strong></span>:3000).
    * If you want you can map docker volumes to local folder (not reccommended).
    * Update <code>SECURE_PASSWORD</code> with a secure password.
    * Update <code>outline.excample.com</code> to match yours.
    :::

2. Create the <code>docker.env</code> file:
    ```bash{7,11,15,32,202}
    # –––––––––––––––– REQUIRED ––––––––––––––––

    NODE_ENV=production

    # Generate a hex-encoded 32-byte random key. You should use `openssl rand -hex 32`
    # in your terminal to generate a random value.
    SECRET_KEY=

    # Generate a unique random key. The format is not important but you could still use
    # `openssl rand -hex 32` in your terminal to produce this.
    UTILS_SECRET=

    # For production point these at your databases, in development the default
    # should work out of the box.
    DATABASE_URL=postgres://user:SECURE_PASSWORD@postgres:5432/outline
    DATABASE_CONNECTION_POOL_MIN=
    DATABASE_CONNECTION_POOL_MAX=
    # Uncomment this to disable SSL for connecting to Postgres
    PGSSLMODE=disable

    # For redis you can either specify an ioredis compatible url like this
    REDIS_URL=redis://redis:6379
    # or alternatively, if you would like to provide additional connection options,
    # use a base64 encoded JSON connection option object. Refer to the ioredis documentation
    # for a list of available options.
    # Example: Use Redis Sentinel for high availability
    # {"sentinels":[{"host":"sentinel-0","port":26379},{"host":"sentinel-1","port":26379}],"name":"mymaster"}
    # REDIS_URL=ioredis://eyJzZW50aW5lbHMiOlt7Imhvc3QiOiJzZW50aW5lbC0wIiwicG9ydCI6MjYzNzl9LHsiaG9zdCI6InNlbnRpbmVsLTEiLCJwb3J0IjoyNjM3OX1dLCJuYW1lIjoibXltYXN0ZXIifQ==

    # URL should point to the fully qualified, publicly accessible URL. If using a
    # proxy the port in URL and PORT may be different.
    URL=https://outline.example.com
    PORT=3000

    # See [documentation](docs/SERVICES.md) on running a separate collaboration
    # server, for normal operation this does not need to be set.
    COLLABORATION_URL=

    # Specify what storage system to use. Possible value is one of "s3" or "local".
    # For "local", the avatar images and document attachments will be saved on local disk.
    FILE_STORAGE=local

    # If "local" is configured for FILE_STORAGE above, then this sets the parent directory under
    # which all attachments/images go. Make sure that the process has permissions to create
    # this path and also to write files to it.
    FILE_STORAGE_LOCAL_ROOT_DIR=/var/lib/outline/data

    # Maximum allowed size for the uploaded attachment.
    FILE_STORAGE_UPLOAD_MAX_SIZE=262144000
    MAXIMUM_IMPORT_SIZE=262144000
    # Override the maximum size of document imports, generally this should be lower
    # than the document attachment maximum size.
    FILE_STORAGE_IMPORT_MAX_SIZE=

    # Override the maximum size of workspace imports, these can be especially large
    # and the files are temporary being automatically deleted after a period of time.
    FILE_STORAGE_WORKSPACE_IMPORT_MAX_SIZE=

    # To support uploading of images for avatars and document attachments in a distributed
    # architecture an s3-compatible storage can be configured if FILE_STORAGE=s3 above.
    AWS_ACCESS_KEY_ID=get_a_key_from_aws
    AWS_SECRET_ACCESS_KEY=get_the_secret_of_above_key
    AWS_REGION=xx-xxxx-x
    AWS_S3_ACCELERATE_URL=
    AWS_S3_UPLOAD_BUCKET_URL=http://s3:4569
    AWS_S3_UPLOAD_BUCKET_NAME=bucket_name_here
    AWS_S3_FORCE_PATH_STYLE=true
    AWS_S3_ACL=private

    # –––––––––––––– AUTHENTICATION ––––––––––––––

    # Third party signin credentials, at least ONE OF EITHER Google, Slack,
    # or Microsoft is required for a working installation or you'll have no sign-in
    # options.

    # To configure Slack auth, you'll need to create an Application at
    # => https://api.slack.com/apps
    #
    # When configuring the Client ID, add a redirect URL under "OAuth & Permissions":
    # https://<URL>/auth/slack.callback
    SLACK_CLIENT_ID=
    SLACK_CLIENT_SECRET=

    # To configure Google auth, you'll need to create an OAuth Client ID at
    # => https://console.cloud.google.com/apis/credentials
    #
    # When configuring the Client ID, add an Authorized redirect URI:
    # https://<URL>/auth/google.callback
    #GOOGLE_CLIENT_ID=
    #GOOGLE_CLIENT_SECRET=

    # To configure Microsoft/Azure auth, you'll need to create an OAuth Client. See
    # the guide for details on setting up your Azure App:
    # => https://wiki.generaloutline.com/share/dfa77e56-d4d2-4b51-8ff8-84ea6608faa4
    AZURE_CLIENT_ID=
    AZURE_CLIENT_SECRET=
    AZURE_RESOURCE_APP_ID=

    # To configure generic OIDC auth, you'll need some kind of identity provider.
    # See documentation for whichever IdP you use to acquire the following info:
    # Redirect URI is https://<URL>/auth/oidc.callback
    OIDC_CLIENT_ID=
    OIDC_CLIENT_SECRET=
    OIDC_AUTH_URI=
    OIDC_TOKEN_URI=
    OIDC_USERINFO_URI=
    OIDC_LOGOUT_URI=

    # Specify which claims to derive user information from
    # Supports any valid JSON path with the JWT payload
    OIDC_USERNAME_CLAIM=preferred_username

    # Display name for OIDC authentication
    OIDC_DISPLAY_NAME=OpenID Connect

    # Space separated auth scopes.
    OIDC_SCOPES=openid profile email

    # To configure the GitHub integration, you'll need to create a GitHub App at
    # => https://github.com/settings/apps
    #
    # When configuring the Client ID, add a redirect URL under "Permissions & events":
    # https://<URL>/api/github.callback
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    GITHUB_APP_NAME=
    GITHUB_APP_ID=
    GITHUB_APP_PRIVATE_KEY=

    # –––––––––––––––– OPTIONAL ––––––––––––––––

    # Base64 encoded private key and certificate for HTTPS termination. This is only
    # required if you do not use an external reverse proxy. See documentation:
    # https://wiki.generaloutline.com/share/1c922644-40d8-41fe-98f9-df2b67239d45
    SSL_KEY=
    SSL_CERT=

    # If using a Cloudfront/Cloudflare distribution or similar it can be set below.
    # This will cause paths to javascript, stylesheets, and images to be updated to
    # the hostname defined in CDN_URL. In your CDN configuration the origin server
    # should be set to the same as URL.
    CDN_URL=

    # Auto-redirect to https in production. The default is true but you may set to
    # false if you can be sure that SSL is terminated at an external loadbalancer.
    FORCE_HTTPS=false

    # Have the installation check for updates by sending anonymized statistics to
    # the maintainers
    ENABLE_UPDATES=true

    # How many processes should be spawned. As a reasonable rule divide your servers
    # available memory by 512 for a rough estimate
    WEB_CONCURRENCY=1

    # You can remove this line if your reverse proxy already logs incoming http
    # requests and this ends up being duplicative
    DEBUG=http

    # Configure lowest severity level for server logs. Should be one of
    # error, warn, info, http, verbose, debug and silly
    LOG_LEVEL=info

    # For a complete Slack integration with search and posting to channels the
    # following configs are also needed, some more details
    # => https://wiki.generaloutline.com/share/be25efd1-b3ef-4450-b8e5-c4a4fc11e02a
    #
    SLACK_VERIFICATION_TOKEN=your_token
    SLACK_APP_ID=A0XXXXXXX
    SLACK_MESSAGE_ACTIONS=true

    # Optionally enable Sentry (sentry.io) to track errors and performance,
    # and optionally add a Sentry proxy tunnel for bypassing ad blockers in the UI:
    # https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option)
    SENTRY_DSN=
    SENTRY_TUNNEL=

    # To support sending outgoing transactional emails such as "document updated" or
    # "you've been invited" you'll need to provide authentication for an SMTP server
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USERNAME=
    SMTP_PASSWORD=
    SMTP_FROM_EMAIL=
    SMTP_REPLY_EMAIL=
    SMTP_TLS_CIPHERS=
    SMTP_SECURE=true

    # The default interface language. See translate.getoutline.com for a list of
    # available language codes and their rough percentage translated.
    DEFAULT_LANGUAGE=en_US

    # Optionally enable rate limiter at application web server
    RATE_LIMITER_ENABLED=true

    # Configure default throttling parameters for rate limiter
    RATE_LIMITER_REQUESTS=1000
    RATE_LIMITER_DURATION_WINDOW=60

    # Iframely API config
    IFRAMELY_URL=https://iframe.ly
    IFRAMELY_API_KEY=
    ```

    :::info
    * Update <code>SECRET_KEY</code> and <code>UTILS_SECRET</code> values with some random string generated with the command:
        ```bash
        openssl rand -hex 32
        ```
    * Update <code>DATABASE_URL</code> value with the same password configured in the <code>docker-compose.yml</code> file.
    :::

3. Now choose a login provider listed in the <code>docker.env</code> file above. Follow the comments to get your api token (see [Login Providers](#login-providers)).


## Run the container
For version of Docker Compose <code>≥ 2</code> use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:3000</code>.

## Login Providers

### Slack
1. First you need to create a <a href="https://slack.com" target="_blank" rel="noreferrer">Slack</a> account and a workspace.

2. Then open https://api.slack.com/apps, create a new app and select <code>From Scratch</code>.

3. Enter your <code>App Name</code> and select your <code>Workspace</code>.

4. In the left bar select <code>OAuth & Permissions</code>

5. For the Redirect URL add the following: 
    - <code>https://outline.example.com/auth/slack.callback</code>: make sure to change it pointing to your dommain.
    - <code>https://localhost/auth/slack.callback</code>

    :::warning
    Note that Slack requires this url is HTTPS.
    :::
6. Under “Scopes” the following are required:
    - <code>identity.avatar</code>
    - <code>identity.basic</code>
    - <code>identity.email</code>
    - <code>identity.team</code>
7. Then, go back to <code>Basic Information</code> and copy your <code>Client ID</code> and <code>Client Secret</code>.
8. Insert the values inside the <code>docker.env</code> file and re-deploy your container.