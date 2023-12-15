# Netdata <img src="/netdata-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Netdata is a distributed real-time, health monitoring platform for systems, hardware, containers & applications, collecting metrics.

::: info
The guide refers to the domain <strong>example.com</strong> and the local IP <strong>192.168.1.100</strong>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check this guide.

Create the following docker-compose.yml:
```yml
version: '2'
services:
  netdata:
    image: netdata/netdata:latest
    container_name: netdata
    ports:
      - 19999:19999
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
    security_opt:
      - apparmor:unconfined
    volumes:
      - /your-config-location:/etc/netdata
      - netdatalib:/var/lib/netdata
      - netdatacache:/var/cache/netdata
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro

volumes:
  netdatalib:
  netdatacache:
```

::: warning
* If you want to change port make sure to change only the left one (<span style="color:orange"><strong>19999</strong></span>:19999).
* Update 'your-config-location' to your desired location for configuration files.
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

After initialization you can open whe web interface at <strong>ht<span>tp://</span>192.168.1.100:19999</strong>

