# Nextcloud <img src="/nextcloud-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


A safe home for all your data. Access & share your files, calendars, contacts, mail & more from any device, on your terms.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.111</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](../docker.md).

Create the following <code>docker-compose.yml</code>:

<details class="details" open>
<summary>Default</summary>

```yml
version: '2'
services:
  db:
    image: mariadb:10.6
    restart: always
    command: --transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW
    volumes:
      - /your-config-location:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=strong-root-password
      - MYSQL_PASSWORD=strong-password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud

  app:
    image: nextcloud:latest
    restart: always
    ports:
      - 8080:80
    links:
      - db
    hostname: nextcloud.metaserver.tech
    volumes:
      - /your-db-config-location:/var/www/html
    environment:
      - MYSQL_PASSWORD=strong-password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=db
```
</details>

<details class="details">
<summary>For Raspberry Pi</summary>

```yml
version: '2'

volumes:
  nextcloud:
  db:

services:
  db:
    image: yobasystems/alpine-mariadb:latest
    restart: always
    command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-read-only-compressed=OFF
    volumes:
      - db:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=strong-root-password
      - MYSQL_PASSWORD=strong-password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud

  app:
    image: nextcloud
    restart: always
    ports:
      - 8080:80
    links:
      - db
    hostname: nextcloud.metaserver.tech

    volumes:
      - nextcloud:/var/www/html
    environment:
      - MYSQL_PASSWORD=strong-password
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=db
```
</details>


::: warning
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>8080</strong></span>:80).
* Update <code>your-config-location</code> and <code>your-db-config-location</code>  to your desired location for configuration files.
* Set a password for the fields <code>MYSQL_PASSWORD</code> and  <code>MYSQL_ROOT_PASSWORD</code>. Make sure they are the same between <code>db</code> and <code>app</code> services.
:::

-> It is reccomended to use docker volumes instead: <code>nextcloud</code> and <code>db</code> as shown in the raspberry pi configuration.

## Run the container
For version of Docker Compose <code>≥ 2</code> use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open whe web interface at <code>ht<span>tp://</span>192.168.1.111:8080</code>

Create an <code>admin</code> account and complete the initial configuration.

## Domain Configuration
To be able to use Nexcloud through a domain it needs some extra configuration.

Create a <code>Proxy Host</code> for Nextcloud as shown [here](./nginx-proxy-manager.md#add-new-host).

Next, open the <code>config.php</code> file inside the configuration folder of Nextcloud (<code>/your-config-location/config</code>).

You should somethings like this:
```php{24,25,26,27}
<?php
$CONFIG = array (
  'htaccess.RewriteBase' => '/',
  'memcache.local' => '\\OC\\Memcache\\APCu',
  'apps_paths' => 
  array (
    0 => 
    array (
      'path' => '/var/www/html/apps',
      'url' => '/apps',
      'writable' => false,
    ),
    1 => 
    array (
      'path' => '/var/www/html/custom_apps',
      'url' => '/custom_apps',
      'writable' => true,
    ),
  ),
  'upgrade.disable-web' => true,
  'instanceid' => 'hghggggggg',
  'passwordsalt' => 'khkhkhkhkhkhkhkhkhkh',
  'secret' => 'kljkljkljkljljljkljljljljlj',
  'trusted_domains' => 
  array (
    0 => '192.168.1.111:8080',
  ),
  'datadirectory' => '/var/www/html/data',
  'dbtype' => 'mysql',
  'version' => '28.0.1.1',
  'overwrite.cli.url' => 'http://192.168.1.111:8080',
  'dbname' => 'nextcloud',
  'dbhost' => 'db',
  'dbport' => '',
  'dbtableprefix' => 'oc_',
  'mysql.utf8mb4' => true,
  'dbuser' => 'nextcloud',
  'dbpassword' => 'strong-password',
  'installed' => true,
);
```

Edit the <code>trusted_domains</code> section and add your domain, for example:
```php
  'trusted_domains' => 
  array (
    0 => '192.168.1.111:8080',
    1 => 'nextcloud.example.com'
  ),
```

After that add a new configuration to trust Nginx Proxy Manager. Change the IP address to your NPM installation:
```php
  'trusted_proxies' => 
  array (
    0 => '192.168.1.100',
  ),
```

If you want to force <code>https</code>, add <code>'overwriteprotocol' => 'https',</code> to the configuration file.

Now restart Nextcloud container.

## Slowness fix
Inside the config folder edit the <code>.htaccess</code> file and add those lines at the start:
```txt
php_value memory_limit 2G
php_value upload_max_filesize 16G
php_value post_max_size 16G
php_value max_input_time 3600
php_value max_execution_time 3600
```
Make sure to set <code>memory_limit</code> based on your system.

## Create Token for external monitoring
Run this command inside nextcloud installation/container:
```bash
sudo -u www-data php occ config:app:set serverinfo token --value token-name
```

Next you can use <code>token-name</code> as your token. 