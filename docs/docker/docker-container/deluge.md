# Deluge <img src="/deluge-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Deluge is a lightweight, Free Software, cross-platform BitTorrent client. Full Encryption; WebUI; Plugin System; Much more...

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](../docker.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  deluge:
    image: lscr.io/linuxserver/deluge
    container_name: deluge-default
    environment:
      - PUID=998
      - PGID=100
      - TZ=Europe/Rome
      - DELUGE_LOGLEVEL=error #optional
    volumes:
      - /your-config-location:/config
      - /your-downloads-location:/downloads
    ports:
      - 8112:8112
      - 6882:6881
      - 6882:6881/udp
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8113</strong></span>:8113).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>TZ</code> to match your timezone.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-downloads-location</code> to your downloads location.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:8112</code>