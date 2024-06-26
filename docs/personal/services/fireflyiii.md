# <img src="/fireflyiii-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Firefly III <Badge type="tip" text="docker" style=" position: relative; float: right;" />

Firefly III is a (self-hosted) manager for your personal finances. It can help you keep track of your expenses and income, so you can spend less and save more. Firefly III supports the use of budgets, categories and tags. Using a bunch of external tools, you can import data. It also has many neat financial reports available.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.200</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

1. Create the following <code>docker-compose.yml</code>:
    ```yml
    version: "3.3"
    services:
      fireflyiii:
        image: fireflyiii/core:latest
        volumes:
          - /your-config-location/firefly_iii_export:/var/www/firefly-iii/storage/export
          - /your-config-location/firefly_iii_upload:/var/www/firefly-iii/storage/upload
        env_file: .env
        environment:
          - APP_URL=http://localhost
          - TRUSTED_PROXIES=*
        ports:
          - 8080:8080
        depends_on:
          - db
        links:
          - db:db
        restart: unless-stopped
      db:
        image: yobasystems/alpine-mariadb:latest
        environment:
          - MYSQL_RANDOM_ROOT_PASSWORD=dbrootpassword
          - MYSQL_USER=firefly
          - MYSQL_PASSWORD=dbpassword
          - MYSQL_DATABASE=firefly
        volumes:
          - /your-db-location:/var/lib/mysql
        restart: unless-stopped
    ```
    ::: info
    * If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8080</strong></span>:8080).
    * Update <code>your-config-location</code> and <code>your-db-location</code> to your desired location for configuration files.
    * Change <code>MYSQL_PASSWORD</code> and <code>MYSQL_RANDOM_ROOT_PASSWORD</code> to a more secure one. 
    :::

2. Create the <code>.env</code> file:
    ```txt
    # You can leave this on "local". If you change it to production most console commands will ask for extra confirmation.
    # Never set it to "testing".
    APP_ENV=local

    # Set to true if you want to see debug information in error screens.
    APP_DEBUG=false

    # This should be your email address.
    # If you use Docker or similar, you can set this variable from a file by using SITE_OWNER_FILE
    SITE_OWNER=mail@example.com

    # The encryption key for your sessions. Keep this very secure.
    # If you generate a new one all existing attachments must be considered LOST.
    # Change it to a string of exactly 32 chars or use something like `php artisan key:generate` to generate it.
    # If you use Docker or similar, you can set this variable from a file by using APP_KEY_FILE
    APP_KEY=32_characters_random_string

    #
    # Firefly III will launch using this language (for new users and unauthenticated visitors)
    # For a list of available languages: https://github.com/firefly-iii/firefly-iii/tree/main/resources/lang
    #
    # If text is still in English, remember that not everything may have been translated.
    DEFAULT_LANGUAGE=en_US

    # The locale defines how numbers are formatted.
    # by default this value is the same as whatever the language is.
    DEFAULT_LOCALE=equal

    # Change this value to your preferred time zone.
    # Example: Europe/Amsterdam
    # For a list of supported time zones, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    TZ=Europe/Rome

    # TRUSTED_PROXIES is a useful variable when using Docker and/or a reverse proxy.
    # Set it to ** and reverse proxies work just fine.
    TRUSTED_PROXIES=*

    # The log channel defines where your log entries go to.
    # Several other options exist. You can use 'single' for one big fat error log (not recommended).
    # Also available are 'syslog', 'errorlog' and 'stdout' which will log to the system itself.
    # A rotating log option is 'daily', creates 5 files that (surprise) rotate.
    # Default setting 'stack' will log to 'daily' and to 'stdout' at the same time.

    # - Docker + versions <= 4.8.1.8 and before: use "stdout"
    # - Docker + versions >  4.8.1.8           : use "docker_out"
    # - Docker + versions >=  5.1.1            : use "stack"
    # - For everything else (als not Docker)   : use 'stack'

    LOG_CHANNEL=stack

    # Log level. You can set this from least severe to most severe:
    # debug, info, notice, warning, error, critical, alert, emergency
    # If you set it to debug your logs will grow large, and fast. If you set it to emergency probably
    # nothing will get logged, ever.
    APP_LOG_LEVEL=notice

    # Database credentials. Make sure the database exists. I recommend a dedicated user for Firefly III
    # For other database types, please see the FAQ: https://docs.firefly-iii.org/support/faq
    # If you use Docker or similar, you can set these variables from a file by appending them with _FILE
    # Use "pgsql" for PostgreSQL
    # Use "mysql" for MySQL and MariaDB.
    # Use "sqlite" for SQLite.
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=firefly
    DB_USERNAME=firefly
    DB_PASSWORD=dbpassword

    # MySQL supports SSL. You can configure it here.
    # If you use Docker or similar, you can set these variables from a file by appending them with _FILE
    MYSQL_USE_SSL=false
    MYSQL_SSL_VERIFY_SERVER_CERT=true
    # You need to set at least of these options
    MYSQL_SSL_CAPATH=/etc/ssl/certs/
    MYSQL_SSL_CA=
    MYSQL_SSL_CERT=
    MYSQL_SSL_KEY=
    MYSQL_SSL_CIPHER=

    # PostgreSQL supports SSL. You can configure it here.
    # If you use Docker or similar, you can set these variables from a file by appending them with _FILE
    PGSQL_SSL_MODE=prefer
    PGSQL_SSL_ROOT_CERT=null
    PGSQL_SSL_CERT=null
    PGSQL_SSL_KEY=null
    PGSQL_SSL_CRL_FILE=null

    # If you're looking for performance improvements, you could install memcached.
    CACHE_DRIVER=file
    SESSION_DRIVER=file

    # If you set either of these to 'redis', you might want to update these settings too
    # If you use Docker or similar, you can set REDIS_HOST_FILE, REDIS_PASSWORD_FILE or
    # REDIS_PORT_FILE to set the value from a file instead of from an environment variable
    REDIS_HOST=127.0.0.1
    REDIS_PASSWORD=null
    REDIS_PORT=6379
    # always use quotes and make sure redis db "0" and "1" exists. Otherwise change accordingly.
    REDIS_DB="0"
    REDIS_CACHE_DB="1"

    # Cookie settings. Should not be necessary to change these.
    # If you use Docker or similar, you can set COOKIE_DOMAIN_FILE to set
    # the value from a file instead of from an environment variable
    COOKIE_PATH="/"
    COOKIE_DOMAIN=
    COOKIE_SECURE=false

    # If you want Firefly III to mail you, update these settings
    # For instructions, see: https://docs.firefly-iii.org/advanced-installation/email
    # If you use Docker or similar, you can set these variables from a file by appending them with _FILE
    MAIL_MAILER=log
    MAIL_HOST=null
    MAIL_PORT=2525
    MAIL_FROM=changeme@example.com
    MAIL_USERNAME=null
    MAIL_PASSWORD=null
    MAIL_ENCRYPTION=null

    # Other mail drivers:
    # If you use Docker or similar, you can set these variables from a file by appending them with _FILE
    MAILGUN_DOMAIN=
    MAILGUN_SECRET=


    # If you are on EU region in mailgun, use api.eu.mailgun.net, otherwise use api.mailgun.net
    # If you use Docker or similar, you can set this variable from a file by appending it with _FILE
    MAILGUN_ENDPOINT=api.mailgun.net

    # If you use Docker or similar, you can set these variables from a file by appending them with _FILE
    MANDRILL_SECRET=
    SPARKPOST_SECRET=


    # Firefly III can send you the following messages
    SEND_REGISTRATION_MAIL=true
    SEND_ERROR_MESSAGE=true

    # These messages contain (sensitive) transaction information:
    SEND_REPORT_JOURNALS=true

    # Set a Mapbox API key here (see mapbox.com) so there might be a map available at various places.
    # If you use Docker or similar, you can set this variable from a file by appending it with _FILE
    MAPBOX_API_KEY=

    # The map will default to this location:
    MAP_DEFAULT_LAT=51.983333
    MAP_DEFAULT_LONG=5.916667
    MAP_DEFAULT_ZOOM=6

    # Firefly III currently supports two provider for live Currency Exchange Rates:
    # "fixer", and "ratesapi".
    # RatesApi.IO (see https://ratesapi.io) is a FREE and OPEN SOURCE live currency exchange rates,
    # built compatible with Fixer.IO, based on data published by European Central Bank, and doesn't require API key.
    CER_PROVIDER=ratesapi

    # If you have select "fixer" as default currency exchange rates,
    # set a Fixer IO API key here (see https://fixer.io) to enable live currency exchange rates.
    # Please note that this WILL ONLY WORK FOR PAID fixer.io accounts because they severely limited
    # the free API up to the point where you might as well offer nothing.
    # If you use Docker or similar, you can set this variable from a file by appending it with _FILE
    FIXER_API_KEY=

    # Firefly III has two options for user authentication. "eloquent" is the default,
    # and "ldap" for LDAP servers.
    # For full instructions on these settings please visit:
    # https://docs.firefly-iii.org/advanced-installation/authentication
    # If you use Docker or similar, you can set this variable from a file by appending it with _FILE
    LOGIN_PROVIDER=eloquent

    #
    # It's also possible to change the way users are authenticated. You could use Authelia for example.
    # Authentication via the REMOTE_USER header is supported. Change the value below to "remote_user_guard".
    #
    # If you do this please read the documentation for instructions and warnings:
    # https://docs.firefly-iii.org/advanced-installation/authentication
    #
    # This function is available in Firefly III v5.3.0 and higher.
    AUTHENTICATION_GUARD=web

    #
    # Likewise, it's impossible to log out users who's authentication is handled by an external system.
    # Enter a custom URL here that will force a logout (your authentication provider can tell you).
    # Setting this variable only works when AUTHENTICATION_GUARD != web
    #
    CUSTOM_LOGOUT_URI=

    # LDAP connection configuration
    # OpenLDAP, FreeIPA or ActiveDirectory
    # # If you use Docker or similar, you can set this variable from a file by appending it with _FILE
    ADLDAP_CONNECTION_SCHEME=OpenLDAP
    ADLDAP_AUTO_CONNECT=true

    # LDAP connection settings
    # You can set the following variables from a file by appending them with _FILE:
    # ADLDAP_CONTROLLERS, ADLDAP_PORT, ADLDAP_BASEDN
    ADLDAP_CONTROLLERS=
    ADLDAP_PORT=389
    ADLDAP_TIMEOUT=5
    ADLDAP_BASEDN=""
    ADLDAP_FOLLOW_REFFERALS=false

    # SSL/TLS settings
    ADLDAP_USE_SSL=false
    ADLDAP_USE_TLS=false
    ADLDAP_SSL_CACERTDIR=
    ADLDAP_SSL_CACERTFILE=
    ADLDAP_SSL_CERTFILE=
    ADLDAP_SSL_KEYFILE=
    ADLDAP_SSL_CIPHER_SUITE=
    ADLDAP_SSL_REQUIRE_CERT=

    # You can set the following variables from a file by appending them with _FILE:
    ADLDAP_ADMIN_USERNAME=
    ADLDAP_ADMIN_PASSWORD=

    # You can set the following variables from a file by appending them with _FILE:
    ADLDAP_ACCOUNT_PREFIX=
    ADLDAP_ACCOUNT_SUFFIX=


    # LDAP authentication settings.
    ADLDAP_PASSWORD_SYNC=false
    ADLDAP_LOGIN_FALLBACK=false

    ADLDAP_DISCOVER_FIELD=distinguishedname
    ADLDAP_AUTH_FIELD=distinguishedname

    # Will allow SSO if your server provides an AUTH_USER field.
    # You can set the following variables from a file by appending them with _FILE:
    WINDOWS_SSO_ENABLED=false
    WINDOWS_SSO_DISCOVER=samaccountname
    WINDOWS_SSO_KEY=AUTH_USER

    # field to sync as local username.
    # You can set the following variable from a file by appending it with _FILE:
    ADLDAP_SYNC_FIELD=userprincipalname

    # You can disable the X-Frame-Options header if it interferes with tools like
    # Organizr. This is at your own risk. Applications running in frames run the risk
    # of leaking information to their parent frame.
    DISABLE_FRAME_HEADER=false

    # You can disable the Content Security Policy header when you're using an ancient browser
    # or any version of Microsoft Edge / Internet Explorer (which amounts to the same thing really)
    # This leaves you with the risk of not being able to stop XSS bugs should they ever surface.
    # This is at your own risk.
    DISABLE_CSP_HEADER=false

    # If you wish to track your own behavior over Firefly III, set valid analytics tracker information here.
    # Nobody uses this except for me on the demo site. But hey, feel free to use this if you want to.
    # Do not prepend the TRACKER_URL with http:// or https://
    # The only tracker supported is Matomo.
    # You can set the following variables from a file by appending them with _FILE:
    TRACKER_SITE_ID=
    TRACKER_URL=

    #
    # Firefly III can collect telemetry on how you use Firefly III. This is opt-in.
    # In order to allow this, change the following variable to true.
    # To read more about this feature, go to this page: https://docs.firefly-iii.org/support/telemetry
    SEND_TELEMETRY=false

    # You can fine tune the start-up of a Docker container by editing these environment variables.
    # Use this at your own risk. Disabling certain checks and features may result in lost of inconsistent data.
    # However if you know what you're doing you can significantly speed up container start times.
    # Set each value to true to enable, or false to disable.

    # Check if the SQLite database exists. Can be skipped if you're not using SQLite.
    # Won't significantly speed up things.
    DKR_CHECK_SQLITE=true

    # Run database creation and migration commands. Disable this only if you're 100% sure the DB exists
    # and is up to date.
    DKR_RUN_MIGRATION=true

    # Run database upgrade commands. Disable this only when you're 100% sure your DB is up-to-date
    # with the latest fixes (outside of migrations!)
    DKR_RUN_UPGRADE=true

    # Verify database integrity. Includes all data checks and verifications.
    # Disabling this makes Firefly III assume your DB is intact.
    DKR_RUN_VERIFY=true

    # Run database reporting commands. When disabled, Firefly III won't go over your data to report current state.
    # Disabling this should have no impact on data integrity or safety but it won't warn you of possible issues.
    DKR_RUN_REPORT=true

    # Generate OAuth2 keys.
    # When disabled, Firefly III won't attempt to generate OAuth2 Passport keys. This won't be an issue, IFF (if and only if)
    # you had previously generated keys already and they're stored in your database for restoration.
    DKR_RUN_PASSPORT_INSTALL=true

    # Leave the following configuration vars as is.
    # Unless you like to tinker and know what you're doing.
    APP_NAME=FireflyIII
    ADLDAP_CONNECTION=default
    BROADCAST_DRIVER=log
    QUEUE_DRIVER=sync
    CACHE_PREFIX=firefly
    SEARCH_RESULT_LIMIT=50
    PUSHER_KEY=
    PUSHER_SECRET=
    PUSHER_ID=
    DEMO_USERNAME=
    DEMO_PASSWORD=
    USE_ENCRYPTION=false
    IS_HEROKU=false
    FIREFLY_III_LAYOUT=v1

    #
    # If you have trouble configuring your Firefly III installation, DON'T BOTHER setting this variable.
    # It won't work. It doesn't do ANYTHING. Don't believe the lies you read online. I'm not joking.
    # This configuration value WILL NOT HELP.
    #
    # This variable is ONLY used in some of the emails Firefly III sends around. Nowhere else.
    # So when configuring anything WEB related this variable doesn't do anything. Nothing
    #
    # If you're stuck I understand you get desperate but look SOMEWHERE ELSE.
    #
    APP_URL=http://localhost
    ```
    ::: warning
    * Change <code>TZ</code> to match your timezone.
    * Update <code>DB_PASSWORD</code> with the same in the docker compose file. 
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

  After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.200:8080</code>

## Set Up Recurring Transactions
Firefly III has a recurring transactions option. In order for that to work, you need to setup a cronjob. Without that, you get an error at the top of the page saying:
```txt
It seems the cron job that is necessary to support recurring transactions has never 
run. This is of course normal when you have just installed Firefly III, 
but this should be something to set up as soon as possible. Please check 
out the help-pages using the (?)-icon in the top right corner of the page.
```

Firefly III has an API to which you make a get request that triggers recurring transactions update. API call URL is: <code>http://FIREFLY_URL/api/v1/cron/TOKEN</code>.

1. To generate a token, go to your <code>Firefly GUI</code> -> <code>Options</code> -> <code>Profile</code> -> <code>Command line token</code> and copy token to URL.

    Example: <code>http://firefly.example/api/v1/cron/6c57c098904f6f4765b52a4bc493687p</code>

2. You can do it on any Linux box with normal cronjob:
    ```bash
    crontab -e
    ```
3. Then add this line:
    ```bash
    0 3 * * * wget -qO- http://firefly.example/api/v1/cron/6c57c098904f6f4765b52a4bc493687p &> /dev/null
    ```

Because we are running Firefly 3 in Docker, more neat option is to add Alpine linux image to our docker compose and run it along within stack:

```yaml
cron:
    image: alpine
    restart: unless-stopped
    command: sh -c "echo \"0 3 * * * wget -qO- http://firefly.example/api/v1/cron/TOKEN &> /dev/null\" | crontab - && crond -f -L /dev/stdout"
```
::: warning 
* In the <code>command:</code> line update <code>firefly.example</code> with your IP address and port (if changed previously) or domain.
* Remember to update <code>TOKEN</code>. 
:::

4.After the stack is running, enter a shell of your Alpine container and check if cronjob is present:
  ```bash
  crontab -l
  ```
  