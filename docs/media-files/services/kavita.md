# <img src="/kavita-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Kavita <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Lightning fast with a slick design, Kavita is a rocket fueled self-hosted digital library which supports a vast array of file formats. Install to start reading and share your server with your friends.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
services:
  kavita:
    image: jvmilazz0/kavita:latest
    container_name: kavita
    volumes:
      - /your-books-location:/books
      - /your-config-location:/kavita/config
    environment:
      - TZ=Europe/Rome
      - PUID=998
      - PGID=100
    ports:
      - "5000:5000"
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>5000</strong></span>:5000).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-books-location</code> to your books folder location.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:8787</code>
