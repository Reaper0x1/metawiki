# <img src="/komga-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Komga <Badge type="tip" text="docker" style=" position: relative; float: right;" />


A media server for your comics, mangas, BDs, magazines and eBooks. 

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.130</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3.3' 
services: 
  komga: 
    image: gotson/komga:latest
    container_name: komga 
    volumes: 
      - /your-config-location:/config 
      - /your-data-location:/data 
      - /etc/timezone:/etc/timezone:ro 
      - /your-library-location:/library 
    ports: 
      - 25600:25600 
    environment: 
      - PUID=100
      - PGID=100
      - TZ=UTC
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>25600</strong></span>:25600).
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-data-location</code> to your desired location for data files.
* Update <code>your-library-location</code> to match your library folder.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.130:25600</code>
