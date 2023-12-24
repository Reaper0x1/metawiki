# Fail2Ban <img src="/fail2ban-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Fail2Ban scans log files like /var/log/auth.log and bans IP addresses conducting too many failed login attempts. It does this by updating system firewall rules to reject new connections from those IP addresses, for a configurable amount of time.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](../docker.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: "2.1"
services:
  fail2ban:
    image: crazymax/fail2ban:latest
    container_name: fail2ban
    network_mode: "host"
    cap_add:
      - NET_ADMIN
      - NET_RAW
    volumes:
      - "/your-config-location:/data"
      - "/var/log/auth.log:/var/log/auth.log:ro"
      - "/your-nginxproxymanager-location/data/logs:/log/npm/:ro"
    restart: always
    environment:
      - PUID=998
      - PGID=100
      - TZ=Europe/Rome
      - F2B_LOG_TARGET=STDOUT
      - F2B_LOG_LEVEL=INFO
      - F2B_DB_PURGE_AGE=365d
      - VERBOSITY=-vv #optional
```

::: warning
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>19999</strong></span>:19999).
* Update <code>your-config-location</code> to your desired location for configuration files.
* Update <code>your-nginxproxymanager-location</code> to your **Nginx Proxy Manager** config folder. The path must include <code>/data/logs</code> at the end.
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

## Configuration (Cloudflare)

Create these three folder inside fail2ban config directoyr:
* <code>/config/data/filter.d</code>
* <code>/config/data/jail.d</code>
* <code>/config/data/action.d</code>

Inside <code>filter.d</code> create the file <code>npm-docker.conf</code>:
```text
[INCLUDES]

[Definition]

failregex = ^<HOST>.+" (4\d\d|3\d\d) (\d\d\d|\d) .+$
            ^.+ 4\d\d \d\d\d - .+ \[Client <HOST>\] \[Length .+\] ".+" .+$
```

Inside <code>jail.d</code> create the file <code>npm-docker.local</code>:
```bash
[npm-docker]
enabled = true
ignoreip = 127.0.0.1/8 192.168.1.0/24
action = cloudflare-apiv4
chain = INPUT
logpath = /log/npm/default-host_access.log
          /log/npm/proxy-host-*_access.log
          /log/npm/proxy-host-*_error.log
maxretry = 1
bantime  = -1
findtime = 86400
```
::: warning
Update the ingoreip to match your network (those host will not be blocked)
:::

Inside <code>action.d</code> create the file <code>cloudflare-apiv4.conf</code>:
```bash
#
# Author: Gilbn from https://technicalramblings.com
# Adapted Source: https://github.com/fail2ban/fail2ban/blob/master/config/action.d/cloudflare.conf and https://guides.wp-bullet.com/integrate-fail2ban-cloudflare-api-v4-guide/
#
# To get your Cloudflare API key: https://dash.cloudflare.com/profile use the Global API Key
#

[Definition]

# Option:  actionstart
# Notes.:  command executed once at the start of Fail2Ban.
# Values:  CMD
#
actionstart =

# Option:  actionstop
# Notes.:  command executed once at the end of Fail2Ban
# Values:  CMD
#
actionstop =

# Option:  actioncheck
# Notes.:  command executed once before each actionban command
# Values:  CMD
#
actioncheck =

# Option:  actionban
# Notes.:  command executed when banning an IP. Take care that the
#          command is executed with Fail2Ban user rights.
# Tags:      IP address
#            number of failures
#            unix timestamp of the ban time
# Values:  CMD

actionban = curl -s -X POST "https://api.cloudflare.com/client/v4/user/firewall/access_rules/rules" \
            -H "X-Auth-Email: <cfuser>" \
            -H "X-Auth-Key: <cftoken>" \
            -H "Content-Type: application/json" \
            --data '{"mode":"block","configuration":{"target":"ip","value":"<ip>"},"notes":"Fail2ban <name>"}'

# Option:  actionunban
# Notes.:  command executed when unbanning an IP. Take care that the
#          command is executed with Fail2Ban user rights.
# Tags:      IP address
#            number of failures
#            unix timestamp of the ban time
# Values:  CMD
#

actionunban = curl -s -X DELETE "https://api.cloudflare.com/client/v4/user/firewall/access_rules/rules/$( \
              curl -s -X GET "https://api.cloudflare.com/client/v4/user/firewall/access_rules/rules?mode=block&configuration_target=ip&configuration_value=<ip>&page=1&per_page=1&match=all" \
             -H "X-Auth-Email: <cfuser>" \
             -H "X-Auth-Key: <cftoken>" \
             -H "Content-Type: application/json" | awk -F"[,:}]" '{for(i=1;i<=NF;i++){if($i~/'id'\042/){print $(i+1);}}}' | tr -d '"' | sed -e 's/^[ \t]*//' | head -n 1)" \
             -H "X-Auth-Email: <cfuser>" \
             -H "X-Auth-Key: <cftoken>" \
             -H "Content-Type: application/json"

[Init]

# Name of the jail in your jail.local file. default = [jail name]
name = npm-docker

# Option: cfuser
# Notes.: Replaces <cfuser> in actionban and actionunban with cfuser value below
# Values: Your CloudFlare user account

cfuser = davidnburgess@gmail.com

# Option: cftoken (Global API Key)
# Notes.: Replaces <cftoken> in actionban and actionunban with cftoken value below
# Values: Your CloudFlare API key
cftoken = 1234567890abcdefghijklmnop
```
::: warning
Be sure to replace <code>cfuser</code> with your actual CloudFlare account email address.

Update the <code>cftoken</code> to your Cloudflare Global API Key. To find this, login to your CloudFlare account and go to "My Profile". Open the API Tokens on this page. Find the "Global API Key" and click "View".
:::

Next, we need to find <code>nginx.conf</code> file of Nginx Proxy Manager.
```bash
find / -name nginx.conf
```
It should return something like this:
```text
/var/lib/docker/overlay2/3410911e538dc834d7919eeebf5e3d431605d8ef6a508ce1e9f2e55121ddc5c7/diff/tmp/openresty/bundle/opm-0.0.7/web/conf/nginx.conf
/var/lib/docker/overlay2/3410911e538dc834d7919eeebf5e3d431605d8ef6a508ce1e9f2e55121ddc5c7/diff/tmp/openresty/bundle/nginx-1.21.4/conf/nginx.conf
/var/lib/docker/overlay2/3410911e538dc834d7919eeebf5e3d431605d8ef6a508ce1e9f2e55121ddc5c7/diff/tmp/openresty/build/opm-0.0.7/web/conf/nginx.conf
/var/lib/docker/overlay2/3410911e538dc834d7919eeebf5e3d431605d8ef6a508ce1e9f2e55121ddc5c7/diff/tmp/openresty/build/nginx-1.21.4/conf/nginx.conf
/var/lib/docker/overlay2/08f8e93c9490cedc957c34246bc8ffaadb89a19a074bfadd388cbe1b5b0fce28/diff/etc/nginx/nginx.conf
/var/lib/docker/overlay2/da8aa35906136b165ac00d8ee0b2879df387af37d41bff3f4849d436acf08dfd/diff/etc/nginx/nginx.conf
/var/lib/docker/overlay2/0b7809a7b193ec3965ba6eed49235c018e3b996df1052ca37c9a225dcd286d11/merged/etc/nginx/nginx.conf
/var/lib/docker/overlay2/0b7809a7b193ec3965ba6eed49235c018e3b996df1052ca37c9a225dcd286d11/diff/etc/nginx/nginx.conf
```

Now we need to know what all those overlays are associate with. Run the following command:
```bash
docker inspect $(docker ps -qa) | jq -r 'map([.Name, .GraphDriver.Data.MergedDir]) | .[] | "\(.[0])\t\(.[1])"'
```
If jq is not installed on your system, run:
```bash
sudo apt install jq
```
It should return something like this:
```text
/fail2ban       /var/lib/docker/overlay2/02ce88111ffbf4d3c8f56a7f26795f46887ad7450817f1324416b24b0677b820/merged
/authentik-server-1     /var/lib/docker/overlay2/698d6065997cf762008c1d7211f527ef5215670262e735dd82fdd1343664d0c4/merged
/authentik-worker-1     /var/lib/docker/overlay2/32bb990e86604727dd3ece9fe9c23d58704233caf6f0deeb539d64d1587232db/merged
/authentik-postgresql-1 /var/lib/docker/overlay2/92e9192d4cfbfdc80a4b79995d8e0f02701e3ec3cf72e29ac9ff6783bb72bbbd/merged
/authentik-redis-1      /var/lib/docker/overlay2/033f7a914cf65363baa29bb7d1ce9080de773f2c04fe2ce0bf3fc850f2d3f35a/merged
/nginx-proxy-manager-app-1      /var/lib/docker/overlay2/0b7809a7b193ec3965ba6eed49235c018e3b996df1052ca37c9a225dcd286d11/merged
```
In this case we are looking for <code>nginx-proxy-manager-app-1</code>.
If we associate the same id we can find the <code>nginx.conf</code> file is located at:
```text
/var/lib/docker/overlay2/0b7809a7b193ec3965ba6eed49235c018e3b996df1052ca37c9a225dcd286d11/merged/etc/nginx/nginx.conf
```

We are going to edit this file:
```bash
sudo nano /var/lib/docker/overlay2/0b7809a7b193ec3965ba6eed49235c018e3b996df1052ca37c9a225dcd286d11/merged/etc/nginx/nginx.conf
```
Find the section that starts with <code>http \{</code> . Scroll down in that section and find <code># Real IP Determination</code>.

Paste the following:
```text
		#CF IPs
        set_real_ip_from 103.21.244.0/22;
        set_real_ip_from 103.22.200.0/22;
        set_real_ip_from 103.31.4.0/22;
        set_real_ip_from 104.16.0.0/12;
        set_real_ip_from 108.162.192.0/18;
        set_real_ip_from 131.0.72.0/22;
        set_real_ip_from 141.101.64.0/18;
        set_real_ip_from 162.158.0.0/15;
        set_real_ip_from 172.64.0.0/13;
        set_real_ip_from 173.245.48.0/20;
        set_real_ip_from 188.114.96.0/20;
        set_real_ip_from 190.93.240.0/20;
        set_real_ip_from 197.234.240.0/22;
        set_real_ip_from 198.41.128.0/17;
        set_real_ip_from 2400:cb00::/32;
        set_real_ip_from 2606:4700::/32;
        set_real_ip_from 2803:f800::/32;
        set_real_ip_from 2405:b500::/32;
        set_real_ip_from 2405:8100::/32;
        set_real_ip_from 2c0f:f248::/32;
        set_real_ip_from 2a06:98c0::/29;

        real_ip_header X-Forwarded-For;
```
::: info
This list of IP addresses may change, so please refer to <a href="https://www.cloudflare.com/ips/" target="_blank" rel="noreferrer">this list</a> of current CloudFlares IP addresses.
:::

Below you should see <code># Local subnets</code>. In that section, look for <code>real_ip_header X-Real-IP</code>.

Comment out <code>real_ip_header X-Real-IP</code> by placing a <code>#</code> in front of it.

Save and exit.

::: info
You may also want to change the permissions of the <code>nginx.conf</code> file from <code>644</code> to <code>604</code> to remove the write permission from the file to keep it from being overwritten when/if the container is updated.
```bash
chmod 604 nginx.conf
```
:::

Now you can restart Fail2Ban container.