# qBittorrent <img src="/qbittorrent-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">

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
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    environment:
      - PUID=998
      - PGID=100
      - TZ=Etc/UTC
      - WEBUI_PORT=8105
    volumes:
      - /your-config-location:/config
      - /your-downloads-location:/downloads
    ports:
      - 8105:8105
      - 6881:6881
      - 6881:6881/udp
    restart: unless-stopped
```

::: warning
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-downloads-location</code> to your downloads folder location.
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

After initialization you can open whe web interface at <code>ht<span>tp://</span>192.168.1.110:8105</code>

::: info
Default username: <code>admin</code>

Default password: <code>adminadmin</code> 

If the password doesn't work look the container logs. You should find a temporary password to use: <code>The WebUI administrator password was not set. A temporary password is provided for this session: YfLGHdrTd</code>
:::

## Change admin password
To change the password simply go to Options > Web UI > Authentication.

Set a new password and click save at the bottom.


## Customization
If you want a dark theme for the web interface follow the steps below:

Enter the directory <code>your-themes-directory</code> and download the theme:
```bash
git clone https://github.com/dracula/qbittorrent.git
```

Change the files permission:
```bash
chmod -R 777 qbittorrent
```

Enable theme selection from menu: → Tools → Options → Web UI → <code>Use alternative Web UI</code>.

In the 'Files locations' bar, you should type <code>/opt/qbittorrent/webui</code>