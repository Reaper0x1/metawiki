# Deluge <img src="/deluge-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Deluge is a lightweight, Free Software, cross-platform BitTorrent client. Full Encryption; WebUI; Plugin System; Much more...

::: info
The guide refers to the domain <strong>example.com</strong> and the local IP <strong>192.168.1.100</strong>, be sure to change them according to your configuration.
:::

## Installation
The installation requires Docker and Docker Compose installed. If you have not installed it please check this guide.

### Docker
Create the following docker-compose.yml:
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

::: warning
* If you want to change port make sure to change only the left one (<span style="color:orange"><strong>8113</strong></span>:8113).
* Update <strong>PUID</strong> and <strong>GUID</strong> accordingly to your system.
* Update <strong>TZ</strong> to match your timezone.
* Update 'your-config-location' to your desired location for configuration files.
* Update 'your-downloads-location' to your downloads location.
:::

For version of Docker Compose ≥ 2 use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open whe web interface at <strong>ht<span>tp://</span>192.168.1.100:8112</strong>