# <img src="/duplicacy-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Duplicacy <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Duplicacy is the only cloud backup tool that allows multiple computers to back up to the same cloud storage, taking advantage of cross-computer deduplication whenever possible, without direct communication among them. This feature turns any cloud storage server supporting only a basic set of file operations into a sophisticated deduplication-aware server.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.101</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3.9'
services:
    duplicacy-web:
        hostname: duplicacy-web-docker-instance
        container_name: duplicacy
        image: 'saspus/duplicacy-web:latest'
        volumes:
            - '/mnt/storage:/backuproot:ro'
            - cache:/cache
            - '/your-logs-location:/logs'
            - '/your-config-location:/config'
        environment:
            - USR_ID=998
            - GRP_ID=100
            - TZ="Europe/Rome"
        ports:
            - '3875:3875/tcp'
        restart: always

volumes:
  cache:
   external: false
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>3875</strong></span>:3875).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>TZ</code> to match your timezone.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-logs-location</code> to your desired logs location.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.101:3875</code>