# <img src="/flaresolverr-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">FlareSolverr <Badge type="tip" text="docker" style=" position: relative; float: right;" />


FlareSolverr is a proxy server to bypass Cloudflare and DDoS-GUARD protection.

It starts a proxy server, and it waits for user requests in an idle state using few resources. When some request arrives, it uses Selenium with the undetected-chromedriver to create a web browser (Chrome). It opens the URL with user parameters and waits until the Cloudflare challenge is solved (or timeout). The HTML code and the cookies are sent back to the user, and those cookies can be used to bypass Cloudflare using other HTTP clients.

::: warning
Web browsers consume a lot of memory. If you are running FlareSolverr on a machine with few RAM, do not make many requests at once. With each request a new browser is launched.
:::

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
services:
  flaresolverr:
    image: flaresolverr/flaresolverr:latest
    container_name: flaresolverr
    environment:
    - LOG_LEVEL=info
    - LOG_HTML=false
    - CAPTCHA_SOLVER=none
    - TZ=Europe/Rome
    ports:
    - "8191:8191"
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8191</strong></span>:8191).
* Update <code>TZ</code> accordingly to your time zone.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:8191</code>

## Prowlarr integration
FlareSolverr helps bypass indexers that are protected by Cloudflare

### Add FlareSolverr to Prowlarr
1. Open Prowlarr and go to `Settings` > `Indexer`.
2. Click on the + sign and select FlareSolverr.
3. Add the following info
    - Name: `FlareSolverr`
    - Tags: `flaresolverr`
    - Host: `http://192.168.1.100:8191`
    - Request Timeout: `60`
4. Test and click Save.

### Add FlareSolverr to your indexer
1. Select the indexer that you want to use with FlareSolverr and click edit.
2. Scroll down to the bottom and add the same tag you set up earlier in step 3.
3. Click Test and Save.
4. Now the indexer should be using FlareSolverr.


