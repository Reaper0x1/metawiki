# <img src="/phpmyadmin-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">phpMyAdmin <Badge type="tip" text="docker" style=" position: relative; float: right;" />


phpMyAdmin is a free software tool written in PHP, intended to handle the administration of MySQL over the Web.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.400</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3.1'

services:
  phpmyadmin:
    image: phpmyadmin:latest
    restart: always
    expose:
      - "7171"
    ports:
      - "7171:80"
    environment:
      - PMA_HOST=192.168.1.141
      - PMA_PORT=3306
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>7171</strong></span>:7171).
* Update <code>PMA_HOST</code> with the IP of your database.
* Update <code>PMA_PORT</code> with the port of your database.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.140:7171</code>