# Whats Up Docker <img src="/whats-up-docker-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


What's up Docker? (aka WUD). Gets you notified when new versions of your Docker containers are available and lets you react the way you want.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.200</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3'

services:
  whatsupdocker:
    image: fmartinou/whats-up-docker:latest
    container_name: whats-up-docker
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - 3000:3000
    restart: always
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>3000</strong></span>:3000).

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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.200:3000</code>

## Configuration

### Discord Bot
Add the following environment variables:
```yml
environment:
      - WUD_TRIGGER_DISCORD_1_URL=
      - WUD_TRIGGER_DISCORD_1_BOTUSERNAME=
```

### Docker Hub Login
To be able to use Docker Hub registry with your own account, add the followinf environment variables:
```yml
environment:
      - WUD_REGISTRY_HUB_LOGIN=<USERNAME>
      - WUD_REGISTRY_HUB_PASSWORD=<TOKEN>
```

### Remote Docker Socket
To monitor remote Docker socket, add the followinf environment variables:
```yml
environment:
      - WUD_WATCHER_<CUSTOM-NAME>_HOST=<IP ADDRESS or DOMAIN>
```