# Gluetun <img src="/gluetun-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


PN client in a thin Docker container for multiple VPN providers, written in Go, and using OpenVPN or Wireguard, DNS over TLS, with a few proxy servers built-in. 

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.110</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](../docker.md).

Create the following <code>docker-compose.yml</code> based on your provider:
::: details OpenVPN
```yml
version: "3"
services:
  gluetun:
    image: qmcgaw/gluetun
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8000:8000/tcp # HTTP control server (optional)
      - 8888:8888/tcp # HTTP proxy
      - 8388:8388/tcp # Shadowsocks
      - 8388:8388/udp # Shadowsocks
    volumes:
      - /your-config-location:/gluetun
    environment:
      - VPN_SERVICE_PROVIDER=custom
      - VPN_TYPE=openvpn
      # OpenVPN:
      - OPENVPN_CUSTOM_CONFIG=/gluetun/custom.ovpn
      - OPENVPN_USER="username"
      - UPDATER_PERIOD=24h
      - OPENVPN_PASSWORD="password"
      - TZ=Europe/Rome
```
:::

::: details NordVPN
```yml
version: "3"
services:
  gluetun:
    image: qmcgaw/gluetun
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8000:8000/tcp # HTTP control server (optional)
      - 8888:8888/tcp # HTTP proxy
      - 8388:8388/tcp # Shadowsocks
      - 8388:8388/udp # Shadowsocks
    volumes:
      - /your-config-location:/gluetun
    environment:
      - VPN_SERVICE_PROVIDER=nordvpn
      - VPN_TYPE=openvpn
      - OPENVPN_USER="service-username"
      - OPENVPN_PASSWORD="service-password"
      - SERVER_COUNTRIES=Italy
      - UPDATER_PERIOD=24h
      - OPENVPN_PASSWORD="password"
      - TZ=Europe/Rome
```

-> <code>service-username</code> and <code>service-password</code> can be found on NordVPN website under "Manual Configuration"
:::

::: warning
* It is **not** recommended to change the port mapping!
* Update <code>TZ</code> to match your timezone.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Set your <code>OPENVPN_USER</code> and <code>OPENVPN_PASSWORD</code> of your OpenVPN Access Server.
* Make sure to place your <code>.ovpn</code> or <code>.conf</code> file inside the config folder. Update <code>OPENVPN_CUSTOM_CONFIG</code> to match that location if different.
:::

For other providers, see the <a href="https://github.com/qdm12/gluetun-wiki" target="_blank" rel="noreferrer">official wiki</a>.

::: info
If the Docker container is inside a <code>LXC Container</code> you need to enable the <code>tun</code> interface as shown in [this guide](../../proxmox/configuration/lxc-configuration.md#enable-tun-interface).
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

## Route container to VPN (qBittorrent)
The goal is to route all traffic of one container to the one just created in order to route everything through the VPN.

qBittorrent container is used as an example.

To be able to view qBittorrent Web UI and make possible for services like Sonarr and Radarr to reach qBittorrent, you need to create a custom network with the command:
```bash
docker network create gluetunbridge
```
Change <code>gluetunbridge</code> to whatever you like. If so, remember to update the name in the <code>docker-compose.yml</code> file below.

::: details Multiple docker-compose.yml file

::: code-group
```yml [gluetun]
version: "3"
services:
  gluetun:
    image: qmcgaw/gluetun
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8000:8000/tcp # HTTP control server
      - 8888:8888/tcp # HTTP proxy
      - 8388:8388/tcp # Shadowsocks
      - 8388:8388/udp # Shadowsocks
      - 8105:8105 # qBittorrent
    volumes:
      - /your-config-location:/gluetun
    environment:
      - VPN_SERVICE_PROVIDER=custom
      - VPN_TYPE=openvpn
      # OpenVPN:
      - OPENVPN_CUSTOM_CONFIG=/gluetun/custom.ovpn
      - OPENVPN_USER="username"
      - OPENVPN_PASSWORD="password"
      - UPDATER_PERIOD=24h
      - FIREWALL_OUTBOUND_SUBNETS=172.23.0.0/16,192.168.1.0/24
      - TZ=Europe/Rome
    network_mode: gluetunbridge
    restart: always
```

```yml [qBittorrent]
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
      - /your-download-location:/downloads
    restart: unless-stopped
    network_mode: "container:gluetun"
```
:::

::: details Single docker-compose.yml file

```yml
version: "3"
services:
  gluetun:
    image: qmcgaw/gluetun
    container_name: gluetun
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      - 8000:8000/tcp # HTTP control server
      - 8888:8888/tcp # HTTP proxy
      - 8388:8388/tcp # Shadowsocks
      - 8388:8388/udp # Shadowsocks
      - 8105:8105 # qBittorrent
    volumes:
      - /your-config-location:/gluetun
    environment:
      - VPN_SERVICE_PROVIDER=custom
      - VPN_TYPE=openvpn
      # OpenVPN:
      - OPENVPN_CUSTOM_CONFIG=/gluetun/custom.ovpn
      - OPENVPN_USER="username"
      - OPENVPN_PASSWORD="password"
      - UPDATER_PERIOD=24h
      - FIREWALL_OUTBOUND_SUBNETS=172.23.0.0/16,192.168.1.0/24
      - TZ=Europe/Rome
    network_mode: gluetunbridge
    restart: always

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
      - /your-download-location:/downloads
    depends_on:
      - gluetun
    network_mode: "service:gluetun"
```
:::

::: info
* Update <code>FIREWALL_OUTBOUND_SUBNETS</code> with your network range.\
After you created the <code>gluetunbridge</code>, you need to change <code>172.23.0.0/16</code> to match gluetunbridge range. To do so, run the following command and look for "IPv4Address":
    ```bash
    docker inspect gluetunbridge
    ```
* Make sure to change <code>network_mode</code> to the same name of Gluetun container.
:::

::: warning
Once qBitorrent is up, go to <code>Settings</code> -> <code>Advanced</code> tab and set the **Network interface** to <code>tun0</code>
:::

Reference guide <a href="https://drfrankenstein.co.uk/2023/04/23/qbittorrent-with-gluetun-vpn-in-container-manager-on-a-synology-nas/" target="_blank" rel="noreferrer">here</a>