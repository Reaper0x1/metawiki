# <img src="/radarr-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Radarr <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Radarr makes failed downloads a thing of the past. Password protected releases, missing repair blocks or virtually any other reason? no worries.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.110</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    environment:
      - PUID=998
      - PGID=100
      - TZ=Etc/UTC
    volumes:
      - /your-config-location:/config
      - /your-movies-location:/movies #optional
      - /your-downloads-location:/downloads #optional
    ports:
      - 7878:7878
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>7878</strong></span>:7878).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-downloads-location</code> to your downloads folder location.
* Update <code>your-movies-location</code> to your movies folder location.

For <code>qBittorrent</code> and <code>Plex</code> integration use the same download and movies folder
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.110:7878</code>

## qBittorrent Integration (Download Client)
Radarr needs a download client to automatically downloads movies for you.

1. To set qBittorrent as a default download client go to <code>Settings</code> > <code>Downloads Clients</code>.
2. Click the plus symbol and add a new client:
    * Host: <code>192.168.1.110</code>
    * Port: <code>8105</code>
    * Username: <code>admin</code>
    * Password: qBittorrent admin password

3. Test the client and save.

::: warning
If you change [qBittorrent](./qbittorrent#docker-compose) port or your ip is different from the defaults you need to adjust them.
:::

## Prowlarr Integration (Indexer)
Radarr needs indexer to be able to do queries and find torrent movies for you and automatically add them to your download client.

To add Prowlarr as your main indexer follow [this guide](./prowlarr#radarr-and-sonarr-integration).

## Customization
You can change the theme of Plex web application by adding these variables to the <code>docker-compose.yml</code> file:
```yml
- DOCKER_MODS=ghcr.io/gilbn/theme.park:radarr
- TP_THEME=dracula
```
 For other themes visit <a href="https://docs.theme-park.dev/themes/plex/" target="_blank" rel="noreferrer">this page</a>.