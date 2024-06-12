# <img src="/pyload-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">pyLoad <Badge type="tip" text="docker" style=" position: relative; float: right;" />


The free and open-source Download Manager written in pure Python

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  pyload:
    image: lscr.io/linuxserver/pyload:latest
    container_name: pyload
    environment:
      - PUID=998
      - PGID=100
      - TZ=Europe/Rome
    volumes:
      - /your-config-location:/config
      - /your-downloads-location:/downloads
    ports:
      - 8000:8000
      - 7227:7227 #optional
    restart: unless-stopped
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8000</strong></span>:8000).
* Update <code>PUID</code> and <code>GUID</code> accordingly to your system.
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-downloads-location</code> to your downloads folder.
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:8000</code>

::: info DEFAULT CREDENTIALS
Default username: <code>pyload</code>

Default password: <code>pyload</code> 
:::

## External Scripts
With pyload you can create scripts that will be executed based on different file conditions.

1. To create a script first find the <code>scripts</code> folder inside pyload config folder, generally <code>/pyload-config/scripts</code>.
2. Inside the scripts you will find several folder, each of which corresponds to a specific action. For example:
    - <code>download_failed</code>: scripts inside this folder will be executed once the download has failed.
    - <code>download_completed</code>: scripts inside this folder will be executed once the download has been downloaded.
3. Create a script file inside one of the folder

You can refer to the official <a href="https://github.com/swayf/pyLoad/blob/master/module/plugins/addons/ExternalScripts.py" target="_blank" rel="noreferrer">external script file</a> to know which arguments can be used.
In <code>Bash</code> you can use these arguments:

- <code>$1</code>: download number
- <code>$2</code>: file name
- <code>$3</code>: destination path with filename
- <code>$4</code>: plugin used for download
- <code>$5</code>: full download link




### Example
This script is placed inside <code>download_completed</code> folder and will check if the word "OnePiece" is present on the file name. If so it renames the file and moves it in another folder.

```bash
#!/bin/sh
echo $1 $2 $3 $4 $5 

if [[ "$2" == *"OnePiece"* ]]; then

    destDir="/anime/One Piece [tvdb4-81797]/Arc 33 - Egg Head Island"

    filename=$(echo "One.Piece.E$(echo "One$2Piece_Ep_1107_SUB_ITA" | awk -F_ '{print $3}').1080p.mp4")
    echo "The new filename is $filename"
    sleep 1

    echo "Moving the episode"
    mv "$3" "$destDir/$filename"

    echo "Episode moved"

fi
```