# Prowlarr <img src="/prowlarr-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Prowlarr is an indexer manager/proxy built on the popular arr .net/reactjs base stack to integrate with your various PVR apps.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.110</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](../docker.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    environment:
      - PUID=100
      - PGID=998
      - TZ=Etc/UTC
    volumes:
      - /your-config-location:/config
    ports:
      - 9696:9696
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>9696</strong></span>:9696).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
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

After initialization you can open whe web interface at <code>ht<span>tp://</span>192.168.1.110:9696</code>

## Add Indexer
To add an Indexer go to the web interface and click <code>Add Indexer</code>

Public one are the only with 'free' access. Semi-Private and Private needs an account or a subscription.

## Radarr and Sonarr Integration
To sync the indexer to Radarr or Sonarr we need to add them to the Prowlarr apps.

Navigate to <code>Settings</code> > <code>Apps</code>.

Click Radarr or Sonarr

Change <code>localhost</code> to the Radarr/Sonarr installation IP address

Next you need to add an <code>API Key</code>. To get one go to Radarr/Sonarr web interface, then <code>Settings</code> > <code>General</code> and copy the key.

Test and click Save.

## Customization
You can change the theme of Plex web application by adding these variables to the <code>docker-compose.yml</code> file:
```yml
- DOCKER_MODS=ghcr.io/gilbn/theme.park:prowlarr
- TP_THEME=dracula
```
 For other themes visit <a href="https://docs.theme-park.dev/themes/plex/" target="_blank" rel="noreferrer">this page</a>.

