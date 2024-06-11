# <img src="/plex-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Plex Media Server <Badge type="tip" text="docker" style=" position: relative; float: right;" />


Plex is your destination to stream TV shows, movies, and sports. Find great movies to watch and stream all your personal media libraries on every device.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.110</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  plex:
    image: lscr.io/linuxserver/plex:amd64-latest
    container_name: plex
    network_mode: host
    environment:
      - PUID=998
      - PGID=100
      - VERSION=docker
      - UMASK=022
    volumes:
      - /your-config-location:/config
      - /your-tv-series-location:/tv
      - /your-movies-location:/movies
    restart: unless-stopped
    security_opt:
      - seccomp=unconfined
```

::: info
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-tv-series-location</code> to your tv series folder location.
* Update <code>your-movies-location</code> to your movies folder location.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.110:32400/web/index.html</code>

## Add Anime Library
::: info
<code>One Piece</code> anime is used as an example.
:::

<a href="https://github.com/Matroxt/one-pace-to-plex" target="_blank" rel="noreferrer">Source guide</a>

### Install Scanner and Agent
Install the <a href="https://docs.theme-park.dev/themes/plex/" target="_blank" rel="noreferrer">Absolute-Series-Scanner (ASS)</a> which has the job to map the files to the right episodes and seasons:

1. Locate the **Plex system folder**. If you followed this guide your config will be at location <code>/config/Library/Application Support/Plex Media Server</code>. 
2. Create the <code>Scanners/Series</code> in the Plex Media Server directory (eg: <code>/config/Library/Application Support/Plex Media Server/Scanners/Series</code>).
3. Download the script inside the <code>Series</code>
```bash
wget https://raw.githubusercontent.com/ZeroQI/Absolute-Series-Scanner/master/Scanners/Series/Absolute%20Series%20Scanner.py
```
4. Adjust permissions of <code>Scanners</code> folder (or follow the <a href="https://github.com/ZeroQI/Absolute-Series-Scanner#install--update" target="_blank" rel="noreferrer">official guide</a>):
```bash
cd ../../
chmod -R 775 ./Scanners
``` 
\
Install the <a href="https://github.com/ZeroQI/Hama.bundle" target="_blank" rel="noreferrer">HAMA plugin</a> whose job it is to get the metadata one the episodes (<a href="https://github.com/ZeroQI/Hama.bundle#installation" target="_blank" rel="noreferrer">official guide</a>). 

1. Inside **Plex system folder** find the <code>Plug-ins</code> folder.
2. Download the HAMA plugin inside the folder:
```bash
git clone https://github.com/ZeroQI/Hama.bundle.git
```
Edit permissions:
```bash
chmod 777 ./Hama.bundle
```

Restart Plex.

### Folder Structure
As usual with Plex, the folder structure and naming is very important. Here's the one we'll be using:
```bash
└───media
    ├───anime
    │   ├───One Piece [tvdb4-81797]
    │   │   ├───Arc 01 - Romance Dawn
    │   │   │   ├───tvdb4.mapping
    │   │   │   └───One.Piece.E1.1080p.mp4
    │   │   ├───Arc 02 - Orange Town
    │   │   ├───Arc XX
    │   │   └───Arc 32 - Wano
    │   └───Other Anime
    ├───audiobooks
    │   └───An audiobook (1971)
    ├───movies
    │   └───A Movie (1970)
    └───tvshows
```
::: info
Please note the <code>[tvdb4-81797]</code> that is added to the "One Piece" folder name. ASS is able to leverage that to enable customs seasons. In the case of One Piece, it allows us to group the different arcs as if they were seasons instead of using the ones provided by TVDB.
:::
\
Create the <code>tvdb4.mapping</code> file like this one:
```text
01|0001|0003|Romance Dawn Arc
02|0004|0008|Orange Town Arc
03|0009|0017|Syrup Village Arc
04|0018|0018|Gaimon Arc
05|0019|0030|Baratie Arc
06|0031|0044|Arlong Park Arc
07|0045|0053|Loguetown Arc
08|0054|0063|Reverse Mountain Arc
09|0064|0067|Whiskey Peak Arc
10|0068|0077|Little Garden Arc
11|0078|0090|Drum Island Arc
12|0091|0130|Arabasta Arc
13|0131|0152|Jaya Arc
14|0153|0195|Skypiea Arc
15|0196|0228|Long Ring Long Land Arc
16|0229|0263|Water Seven Arc
17|0264|0312|Enies Lobby Arc
18|0313|0336|Post-Enies Lobby Arc
19|0337|0381|Thriller Bark Arc
20|0382|0405|Sabaody Archipelago Arc
21|0406|0421|Amazon Lily Arc
22|0422|0456|Impel Down Arc
23|0457|0489|Marineford Arc
24|0490|0516|Post-War Arc
25|0517|0522|Return to Sabaody Arc
26|0523|0578|Fishman Island Arc
27|0579|0628|Punk Hazard Arc
28|0629|0746|Dressrosa Arc
29|0747|0776|Zou Arc
30|0777|0877|Whole Cake Island Arc
31|0878|0889|Reverie Arc
32|0890|1085|Wano Arc
33|1086|1300|Egg Head Island Arc  (unknown length)
```

In each arc directory, place the <code>tvdb4.mapping</code> file. (You could also not use the arcs directory and keep all you episodes in the same folder, and have the <code>tvdb4.mapping</code> directly in the <code>One Piece [tvdb4-81797]</code> folder)

::: warning
Each episode file must be renamed inf this format: <code>One.Piece.E1.1080p.mp4</code>.
:::

### Add library
Go to Plex > <code>Settings</code> > <code>Manage</code> > <code>Libraries</code> and click <code>Add library</code>.

Select the type and folder location and then in the <code>Advanced</code> tab set this values:
* Scanner: <code>Absolute Series Scanner</code>
* Agent: <code>HamaTV</code>

If not cover are fetched you can try to enable <code>Load all poster metadata sources</code>

Now you can add the library and manually scan the library if not already started automatically.

## Customization
You can change the theme of Plex web application by adding these variables to the <code>docker-compose.yml</code> file:
```yml
- DOCKER_MODS=ghcr.io/gilbn/theme.park:plex
- TP_THEME=aquamarine
```
 For other themes visit <a href="https://docs.theme-park.dev/themes/plex/" target="_blank" rel="noreferrer">this page</a>.

