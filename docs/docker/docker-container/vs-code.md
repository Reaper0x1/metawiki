# VS Code Server <img src="/vs-code-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.

::: info
The guide refers to the domain <strong>example.com</strong> and the local IP <strong>192.168.1.100</strong>, be sure to change them according to your configuration.
:::

## Installation
The installation requires Docker and Docker Compose installed. If you have not installed it please check this guide.

### Docker
Create the following docker-compose.yml:
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

::: warning
* If you want to change port make sure to change only the left one (<span style="color:orange"><strong>8443</strong></span>:8443).
* Set a password for <strong>PASSWORD</strong> and <strong>SUDO_PASSWORD</strong> rows.
* If you have a public domain set <strong>PROXY_DOMAIN</strong> to your subdomain that will point to the Code server. If not, you can delete the row.
* Update 'your-config-location' to your desired location for configuration files.
* Update 'your-workspace-location' to your workspation location.
:::

For version of Docker Compose ≥ 2 use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open whe web interface at <strong>ht<span>tp://</span>192.168.1.100:8443</strong>