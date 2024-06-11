# <img src="/projectsend-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">ProjectSend <Badge type="tip" text="docker" style=" position: relative; float: right;" />


ProjectSend is an open source, clients-oriented, private file sharing web application.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.52</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
---
services:
  projectsend:
    image: lscr.io/linuxserver/projectsend:latest
    container_name: projectsend
    environment:
      - PUID=100
      - PGID=100
      - TZ=Etc/UTC
      - MAX_UPLOAD=5000
    volumes:
      - /your-config-location:/config
      - /your-data-location:/data
    ports:
      - 80:80
    restart: unless-stopped
    links:
      - "mariadb:database"

  mariadb:
    restart: unless-stopped
    container_name: projectsend-mariadb
    image: mariadb:10.7
    volumes:
      - /your-mariadb-config-location:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: some-strong-password
      MYSQL_DATABASE: projectsend
      MYSQL_USER: projectsend
      MYSQL_PASSWORD: some-password
      PUID: 100
      PGID: 100
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>80</strong></span>:80).
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-data-location</code> to your desired location for data files.
* Update <code>your-mariadb-config-location</code> to your desired location for mariadb configuration files.
* Update <code>PUID</code> and <code>PGID</code> to macth your system.
* Change <code>MYSQL_ROOT_PASSWORD</code> and <code>MYSQL_PASSWORD</code> with some secure passwords.
* If you want you can change <code>MAX_UPLOAD</code> with another value (**1 = 1MB**, default = 5GB).
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.52:80</code>

## Configuration

After opening the web page, update the following values:
* Host: <code>mariadb</code>
* Username: <code>projectsend</code>
* Password: the one you put in <code>MYSQL_PASSWORD</code>
* Default maximum upload file size: <code>5120</code>

Click **Check** and then **Write config file**.  
Give a name and create an admin account.