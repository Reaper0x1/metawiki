# <img src="/bitwarden-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Vaultwarden <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Unofficial Bitwarden compatible server written in Rust. 
Bitwarden is an open-source password management service that stores sensitive information, such as website credentials, in an encrypted vault.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code> based on your provider:
```yml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      WEBSOCKET_ENABLED: true 
      SIGNUPS_ALLOWED: true
      DOMAIN: "https://password.example.com"
      PUID: 998
      PGID: 100
    volumes:
      - /your-config-location:/data
```

::: warning
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>80</strong></span>:80).
* Update <code>your-config-location</code> to your desired location for configuration files.
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

After initialization you can open the web interface at http://192.168.1.100:80

## Account creation 
If you want to create only one account, follow these steps:
1. After the container is up, create an account.
2. Update your docker compose file by changing <code>SIGNUPS_ALLOWED</code> value to <code>false</code>:
```yml{3}
    environment:
      WEBSOCKET_ENABLED: true 
      SIGNUPS_ALLOWED: false
      DOMAIN: "https://password.example.com"
      PUID: 998
      PGID: 100
```
3. Redeploy the container.