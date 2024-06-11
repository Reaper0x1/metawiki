# Mylar3 <img src="/mylar3-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Mylar is an automated Comic Book (cbr/cbz) downloader program for use with NZB and torrents.

Mylar allows you to create a watchlist of series that it monitors for various things (new issues, updated information, etc). It will grab, sort, and rename downloaded issues. It will also allow you to monitor weekly pull-lists for items belonging to said watchlisted series to download, as well as being able to monitor and maintain story-arcs.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.130</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  mylar3:
    image: lscr.io/linuxserver/mylar3:latest
    container_name: mylar3
    environment:
      - PUID=100
      - PGID=100
      - TZ=Etc/UTC
    volumes:
      - /your-config-location:/config
      - /your-comics-location:/comics
      - /your-downloads-location:/downloads
    ports:
      - 8090:8090
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8090</strong></span>:8090).
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-comics-location</code> to your comics library.
* Update <code>your-downloads-location</code> to your downloads folder.
* Update <code>PUID</code> and <code>PGID</code> to macth your system.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.130:8090</code>

## qBittorrent Integration (Download Client)
Radarr needs a download client to automatically downloads movies for you.

To set qBittorrent as a default download client go to <code>Settings</code> > <code>Downloads Clients</code>. Select qBittorrent and enter:
* Host: <code>192.168.1.110:8105</code>
* Username: <code>admin</code>
* Password: qBittorrent admin password

Test the client and save.

::: warning
If you change [qBittorrent](/media-docs-files/services/qbittorrent#docker-compose) port or your ip is different from the defaults you need to adjust them.
:::

## Prowlarr Integration (Indexer)
Radarr needs indexer to be able to do queries and find torrent movies for you and automatically add them to your download client.

To add Prowlarr as your main indexer follow [this guide](/media-docs-files/services/prowlarr#radarr-and-sonarr-integration).