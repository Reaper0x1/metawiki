# <img src="/stirling-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Stirling PDF <Badge type="tip" text="docker" style=" position: relative; float: right;" />


This is a robust, locally hosted web-based PDF manipulation tool using Docker. It enables you to carry out various operations on PDF files, including splitting, merging, converting, reorganizing, adding images, rotating, compressing, and more. This locally hosted web application has evolved to encompass a comprehensive set of features, addressing all your PDF requirements.

Stirling PDF does not initiate any outbound calls for record-keeping or tracking purposes.

All files and PDFs exist either exclusively on the client side, reside in server memory only during task execution, or temporarily reside in a file solely for the execution of the task. Any file downloaded by the user will have been deleted from the server by that point.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3.3'
services:
  stirling-pdf:
    image: frooodle/s-pdf:0.25.0
    container_name: stirling-pdf
    restart: unless-stopped
    ports:
      - '8080:8080'
    volumes:
      - /your-config-location:/configs
#      - /location/of/customFiles:/customFiles/ (optional)
#      - /location/of/logs:/logs/ (optional)
    environment:
      - DOCKER_ENABLE_SECURITY=false
      - INSTALL_BOOK_AND_ADVANCED_HTML_OPS=true
      - LANGS=it_IT
      - PUID=998
      - PGID=100
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8080</strong></span>:8080).
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

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:8080</code>

## OCR Language Packs and Setup
Stirling-PDF uses <a href="https://github.com/ocrmypdf/OCRmyPDF" target="_blank" rel="noreferrer">OCRmyPDF</a> which in turn uses tesseract for its text recognition. All credit goes to them for this awesome work!

Tesseract OCR supports a variety of languages. You can find additional language packs in the Tesseract GitHub repositories:
- <a href="https://github.com/tesseract-ocr/tessdata_fast" target="_blank" rel="noreferrer">tessdata_fast</a>: These language packs are smaller and faster to load, but may provide lower recognition accuracy.
- <a href="https://github.com/tesseract-ocr/tessdata" target="_blank" rel="noreferrer">tessdata</a>: These language packs are larger and provide better recognition accuracy, but may take longer to load.

Depending on your requirements, you can choose the appropriate language pack for your use case. By default Stirling-PDF uses the tessdata_fast eng but this can be replaced.

### Installing Language Packs
1. Download the desired language pack(s) by selecting the <code>.traineddata</code> file(s) for the language(s) you need.
2. Place the <code>.traineddata</code> files in the Tesseract tessdata directory: /usr/share/tessdata

    :::danger
    DO NOT REMOVE EXISTING ENG.TRAINEDDATA, IT'S REQUIRED.
    :::

3. Modify your docker-compose.yml file to include the following volume configuration:
    ```yml{12}
    version: '3.3'
    services:
    stirling-pdf:
        image: frooodle/s-pdf:0.25.0
        container_name: stirling-pdf
        restart: unless-stopped
        ports:
        - '8080:8080'
        volumes:
        - /your-config-location:/configs
        # Required for extra OCR languages
        - /your-tessdata-location:/usr/share/tessdata 
    #      - /location/of/customFiles:/customFiles/ (optional)
    #      - /location/of/logs:/logs/ (optional)
        environment:
        - DOCKER_ENABLE_SECURITY=false
        - INSTALL_BOOK_AND_ADVANCED_HTML_OPS=true
        - LANGS=it_IT
        - PUID=998
        - PGID=100
    ```

