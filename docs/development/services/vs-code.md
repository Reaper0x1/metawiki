# VS Code Server <img src="/vs-code-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: code-server
    environment:
      - PUID=998
      - PGID=100
      - TZ=Europe/Rome
      - PASSWORD=yourpassword #optional
      - SUDO_PASSWORD=yourrootpassword #optional
      - PROXY_DOMAIN=code.example.com #optional
      - DEFAULT_WORKSPACE=/workspace #optional
    volumes:
      - /your-config-location:/config
      - /your-workspace-location:/workspace
    ports:
      - 8443:8443
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8443</strong></span>:8443).
* Set a password for <code>PASSWORD</code> and <code>SUDO_PASSWORD</code> rows.
* If you have a public domain set <code>PROXY_DOMAIN</code> to your subdomain that will point to the VS Code server. If not, you can delete the row.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-workspace-location</code> to your workspation location.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:8443</code>