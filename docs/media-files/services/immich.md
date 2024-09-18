# <img src="/immich-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Immich <Badge type="tip" text="docker" style=" position: relative; float: right;" />


High performance self-hosted photo and video management solution.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

1. Create the following <code>docker-compose.yml</code>:
    ```yml
    services:
    immich-server:
        container_name: immich-server
        image: ghcr.io/immich-app/immich-server:${IMMICH_VERSION:-release}
        volumes:
        - ${UPLOAD_LOCATION}:/usr/src/app/upload
        - /etc/localtime:/etc/localtime:ro
        env_file:
        - stack.env
        ports:
        - 3001:3001
        depends_on:
        - redis
        - database
        restart: unless-stopped

    immich-machine-learning:
        container_name: immich-machine-learning
        image: ghcr.io/immich-app/immich-machine-learning:${IMMICH_VERSION:-release}
        volumes:
        - model-cache:/cache
        env_file:
        - stack.env
        restart: unless-stopped

    redis:
        container_name: immich-redis
        image: docker.io/redis:6.2-alpine@sha256:d6c2911ac51b289db208767581a5d154544f2b2fe4914ea5056443f62dc6e900
        healthcheck:
        test: redis-cli ping || exit 1
        restart: unless-stopped

    database:
        container_name: immich-postgres
        image: docker.io/tensorchord/pgvecto-rs:pg14-v0.2.0@sha256:90724186f0a3517cf6914295b5ab410db9ce23190a2d9d0b9dd6463e3fa298f0
        environment:
        POSTGRES_PASSWORD: ${DB_PASSWORD}
        POSTGRES_USER: ${DB_USERNAME}
        POSTGRES_DB: ${DB_DATABASE_NAME}
        POSTGRES_INITDB_ARGS: '--data-checksums'
        PUID: 988
        PGID: 100
        volumes:
        - ${DB_DATA_LOCATION}:/var/lib/postgresql/data
        healthcheck:
        test: pg_isready --dbname='${DB_DATABASE_NAME}' || exit 1; Chksum="$$(psql --dbname='${DB_DATABASE_NAME}' --username='${DB_USERNAME}' --tuples-only --no-align --command='SELECT COALESCE(SUM(checksum_failures), 0) FROM pg_stat_database')"; echo "checksum failure count is $$Chksum"; [ "$$Chksum" = '0' ] || exit 1
        interval: 5m
        start_interval: 30s
        start_period: 5m
        command: ["postgres", "-c" ,"shared_preload_libraries=vectors.so", "-c", 'search_path="$$user", public, vectors', "-c", "logging_collector=on", "-c", "max_wal_size=2GB", "-c", "shared_buffers=512MB", "-c", "wal_compression=on"]
        restart: unless-stopped

    volumes:
    model-cache:

    ```

    ::: info
    * If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>3001</strong></span>:3001).
    * Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
    :::

2. Create the stack.env file and update the variables:
```txt{1,2,4,7,8}
UPLOAD_LOCATION=/your-upload-location
DB_DATA_LOCATION=/your-config-location
IMMICH_VERSION=latest
DB_PASSWORD=secure-password
DB_USERNAME=postgres
DB_DATABASE_NAME=immich
PUID=998
PGID=100
```


## Run the container
For version of Docker Compose <code>≥ 2</code> use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:3001</code>
