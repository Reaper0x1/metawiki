# Authelia <img src="/authelia-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Authelia is an open-source authentication and authorization server and portal fulfilling the identity and access management (IAM) role of information security in providing multi-factor authentication and single sign-on (SSO) for your applications via a web portal. It acts as a companion for common reverse proxies.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.

Additionally, every service that must be protected must be in a **docker container**.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3.3'
    
services:
  authelia:
    image: authelia/authelia
    container_name: authelia
    volumes:
      - /your-config-location:/config
    ports:
      - 9091:9091
    environment:
      - TZ=Europe/Rome
    restart: always
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>9091</strong></span>:9091).
* Update <code>TZ</code> to match your timezone.
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

## Configuration File
After the container is up the <code>configuration.yml</code> file is created in the config folder. Delete that file and create a new one with the following code:
```yml{8,10,29,66,69,79}
# yamllint disable rule:comments-indentation
---
###############################################################################
#                           Authelia Configuration                            #
###############################################################################

theme: dark #light/dark
jwt_secret: 1234567890abcdefghifjkl #any text or number you want to add here to create jwt Token

default_redirection_url: https://google.com/ #where to redirect for a non-existent URL

server:
  host: 0.0.0.0
  port: 9091
  path: ""
  read_buffer_size: 4096
  write_buffer_size: 4096
  enable_pprof: false
  enable_expvars: false
  disable_healthcheck: false
  tls:
    key: ""
    certificate: ""

log:
  level: debug

totp:
  issuer: example.com #your authelia top-level domain
  period: 30
  skew: 1

authentication_backend:
  disable_reset_password: false
  refresh_interval: 5m
  file:
    path: /config/users_database.yml #this is where your authorized users are stored
    password:
      algorithm: argon2id
      iterations: 1
      key_length: 32
      salt_length: 16
      memory: 1024
      parallelism: 8

access_control:
  default_policy: deny
  rules:
    ## bypass rule
    - domain: 
        - "auth.example.com" #This should be your authentication URL
      policy: bypass
    - domain: "example.com" #example domain to protect
      policy: one_factor
    - domain: "sub1.example.com" #example subdomain to protect
      policy: one_factor
    - domain: "sub2.example.com" #example subdomain to protect
      policy: one_factor
    - domain: "*.example.com" #example to protect all subdomains under top-level domain
      policy: one_factor
      #add or remove additional subdomains as necessary. currenlty only supports ONE top-level domain
      #any time you add a new subdomain, you will need to restart the Authelia container to recognize the new settings/rules

session:
  name: authelia_session
  secret: unsecure_session_secret #any text or number you want to add here to create jwt Token
  expiration: 3600  # 1 hour
  inactivity: 300  # 5 minutes
  domain: yourdomain.com  # Should match whatever your root protected domain is

regulation:
  max_retries: 3
  find_time: 10m
  ban_time: 12h

storage:
  local:
    path: /config/db.sqlite3 #this is your databse. You could use a mysql database if you wanted, but we're going to use this one.
  encryption_key: you_must_generate_a_random_string_of_more_than_twenty_chars_and_configure_this #added Dec 5 2021
  
notifier:
  disable_startup_check: true #true/false
  smtp:
    username: youremail@gmail.com #your email address
    password: password #your email password
    host: smtp.gmail.com #email smtp server
    port: 587 #email smtp port
    sender: youremail@gmail.com
    identifier: localhost
    subject: "[Authelia] {title}" #email subject
    startup_check_address: youremail@gmail.com
    disable_require_tls: false
    disable_html_emails: false
    tls:
      skip_verify: false
      minimum_version: TLS1.2
...
```
::: info
* You must change the <code>jwt_secret</code> to a random string of character and numbers.
* Set <code>default_redirection_url</code> to your preferences. The user will be redirected to this when visiting a non-existent URL.
* If you changed the port in the docker-compose.yml file, you must update the port under **server**.
* Under **totp**, update <code>issuer</code> with your top level domain (eg. example.com).
* <code>access_control</code>: add your subdomains that need to be protected.
* Under **session**, change <code>secret</code> to a random string and update <code>domain</code> with your top level domain.
* Under **storage**, change <code>encryption_key</code> to a random string.
* At the end, update the <code>smtp</code> configuration with your own.
:::

-> Before starting the container, you must create the users database like below.

## Users Database
In the **config** folder create a new file named <code>users_database.yml</code>. If it is already present, overwrite it with: 
```yml{2,4}
users:
  user1: 
    displayname: "User Name 1" 
    password: "$argon2i$v=19$m=1024,t=1,p=8$eTQ3MXdqOGFiaDZoMUtMVw$OeHWQSg9zGKslOepe5t4D1T9BZJjHA1Z+doxZrZYDgI" 
    email: youremail@gmail.com 
    groups: #enter the groups you want the user to be part of below
      - admins
      - dev

```
Change <code>user1</code> to whatever you would like. This is the username used to login.

Update the <code>displayname</code> and <code>email</code>.

To generate the password you must go to https://argon2.online/:
* Plain Text Input: <code>write your password</code>
* Salt: <code>just click the gear to create a random one</code>
* Parallelism Factor: <code>8</code>
* Memory Cost>: <code>1024</code>
* Iterations: <code>1</code>
* Hash Length: <code>32</code>
* Type: <code>Argon2id</code>

Next click **Generate Hash**, copy the <code>Output in Encoded Form </code> and paste it in the <code>password</code> field inside the file.

Now you can restart the Authelia container.

::: info
Any time you add a new user, you will need to restart the Authelia container to recognize the new settings/rules.
:::

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:9091</code>.

## Nginx Proxy Manager Integration
Create a <code>Proxy Host</code> for Authelia and your other services as shown [here](./nginx-proxy-manager.md#add-new-host).

In the Authelia Proxy Host go to <code>Advanced</code> tab and paste this configuration:
```yml{2,31}
location / {
set $upstream_authelia http://192.168.1.100:9091;
proxy_pass $upstream_authelia;
client_body_buffer_size 128k;

#Timeout if the real server is dead
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;

# Advanced Proxy Config
send_timeout 5m;
proxy_read_timeout 360;
proxy_send_timeout 360;
proxy_connect_timeout 360;

# Basic Proxy Config
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $http_host;
proxy_set_header X-Forwarded-Uri $request_uri;
proxy_set_header X-Forwarded-Ssl on;
proxy_redirect  http://  $scheme://;
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_cache_bypass $cookie_session;
proxy_no_cache $cookie_session;
proxy_buffers 64 256k;

# If behind reverse proxy, forwards the correct IP, assumes you're using Cloudflare. Adjust IP for your Docker network.
set_real_ip_from 192.168.1.0/24;
real_ip_header CF-Connecting-IP;
real_ip_recursive on;
}
```

* You must change <code>http://192.168.1.100:9091</code> to the IP address and port of your Authelia installation.

* Make sure that <code>set_real_ip_from</code> matches your netowrk setup.

Next you can save the configuration.

Now, for every subdomain you want to protect, add this configuration to his <code>Advanced</code> tab:
```yml{3,33,34,45,73}
location /authelia {
internal;
set $upstream_authelia http://192.168.1.100:9091/api/verify; #change the IP and Port to match the IP and Port of your Authelia container
proxy_pass_request_body off;
proxy_pass $upstream_authelia;    
proxy_set_header Content-Length "";

# Timeout if the real server is dead
proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
client_body_buffer_size 128k;
proxy_set_header Host $host;
proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr; 
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $http_host;
proxy_set_header X-Forwarded-Uri $request_uri;
proxy_set_header X-Forwarded-Ssl on;
proxy_redirect  http://  $scheme://;
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_cache_bypass $cookie_session;
proxy_no_cache $cookie_session;
proxy_buffers 4 32k;

send_timeout 5m;
proxy_read_timeout 240;
proxy_send_timeout 240;
proxy_connect_timeout 240;
}

location / {
set $upstream_plex $forward_scheme://$server:$port; 
proxy_pass $upstream_plex; 

auth_request /authelia;
auth_request_set $target_url https://$http_host$request_uri;
auth_request_set $user $upstream_http_remote_user;
auth_request_set $email $upstream_http_remote_email;
auth_request_set $groups $upstream_http_remote_groups;
proxy_set_header Remote-User $user;
proxy_set_header Remote-Email $email;
proxy_set_header Remote-Groups $groups;

error_page 401 =302 https://auth.example.com/?rd=$target_url; #change this to match your authentication domain/subdomain

client_body_buffer_size 128k;

proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;

send_timeout 5m;
proxy_read_timeout 360;
proxy_send_timeout 360;
proxy_connect_timeout 360;

proxy_set_header Host $host;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection upgrade;
proxy_set_header Accept-Encoding gzip;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host $http_host;
proxy_set_header X-Forwarded-Uri $request_uri;
proxy_set_header X-Forwarded-Ssl on;
proxy_redirect  http://  $scheme://;
proxy_http_version 1.1;
proxy_set_header Connection "";
proxy_cache_bypass $cookie_session;
proxy_no_cache $cookie_session;
proxy_buffers 64 256k;

set_real_ip_from 192.168.1.0/24; 
real_ip_header CF-Connecting-IP;
real_ip_recursive on;

}
```
* You must change <code>http://192.168.1.100:9091/api/verify</code> to the IP address and port of your Authelia installation.
* In **error_page** change <code>https://auth.example.com/?rd=$target_url</code> to match your Authelia subdomain.
* At the end, update <code>set_real_ip_from</code> to match your network setup. 

At the middle of the configuration you can see this two lines:
```yml
set $upstream_plex $forward_scheme://$server:$port; 
proxy_pass $upstream_plex; 
```
Here you must change $upstream_<span style="color:orange"><strong>plex</strong></span> with the name of the container in both lines.
::: tip
If the container name is like <code>nginx-proxy-manager</code>, you must replace '-' with '_', resulting in <code>$upstream_nginx_proxy_manager</code>.
:::

Now you can save the configuration.

If we go to the subdomain of the service configured before, for example <code>plex.example.com</code>, we will be redirected to <code>auth.example.com</code>. After logging in we should be redirected back to <code>plex.example.com</code>.