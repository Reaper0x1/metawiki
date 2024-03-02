# Homepage <img src="/homepage-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


A modern, fully static, fast, secure fully proxied, highly customizable application dashboard with integrations for over 100 services and translations into multiple languages. Easily configured via YAML files or through docker label discovery. 

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.104</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](../docker.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "3.3"
services:
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    container_name: homepage
    ports:
      - 3000:3000
    volumes:
      - /your-config-location:/app/config # Make sure your local config directory exists
      - /var/run/docker.sock:/var/run/docker.sock # (optional) For docker

    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>3000</strong></span>:3000).
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.104:3000</code>

## Configuration
Full guide <a href="https://gethomepage.dev" target="_blank" rel="noreferrer">here</a>.

### Add external Docker socket
::: warning
Before starting, you must have followed [this guide](../extra-configuration.md#enable-tcp-port-2375-for-external-connection-to-docker) on exposing docker socket port for remote communication.
:::

Edit <code>docker.yaml</code> in Homepage confi folder and add:
```yaml
my-docker:
   host: 192.168.1.111
   port: 2375
```
Replace <code>my-docker</code> with your preferred one and then replace <code>192.168.1.111</code> with the IP address of your remote docker.

Now you can use the docker integration within <code>services.yaml</code>:
```yaml
- Emby:
    href: "http://emby.home/"
    description: Media server
    server: my-docker # The docker server that was configured
    container: plex # The name of the container you'd like to connect
```