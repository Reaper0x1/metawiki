# Plex Media Server <img src="/plex-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Plex is your destination to stream TV shows, movies, and sports. Find great movies to watch and stream all your personal media libraries on every device.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.110</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check this guide.

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  plex:
    image: lscr.io/linuxserver/plex:amd64-latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=998
      - PGID=100
      - VERSION=docker
      - UMASK=022
    volumes:
      - /your-config-location:/config
      - /your-tv-series-location:/tv
      - /your-movies-location:/movies
    restart: unless-stopped
    security_opt:
      - seccomp=unconfined
```

::: warning
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-tv-series-location</code> to your tv series folder location.
* Update <code>your-movies-location</code> to your movies folder location.
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

After initialization you can open whe web interface at <code>ht<span>tp://</span>192.168.1.110:32400/web/index.html</code>

## Customization
You can change the theme of Plex web application by adding these variables to the <code>docker-compose.yml</code> file:
```yml
- DOCKER_MODS=ghcr.io/gilbn/theme.park:plex
- TP_THEME=aquamarine
```
 For other themes visit <a href="https://docs.theme-park.dev/themes/plex/" target="_blank" rel="noreferrer">this page</a>.

