# <img src="/npm-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Nginx Proxy Manager <Badge type="tip" text="docker" style=" position: relative; float: right;" /><Badge type="warning" text="lxc" style=" position: relative; float: right;" />


The Nginx Proxy Manager conveniently manages proxy hosts for your web services, whether on your home network or otherwise.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Docker Compose
The installation requires Docker and Docker Compose installed. If you have not installed it please check [this guide](/docker/install.md).

Create the following <code>docker-compose.yml</code>:
```yml
version: '3'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>80</strong></span>:80).
* Update the <code>volumes</code> to your desired location (only left path).
:::

## Proxmox LXC
Run the following command in the Proxmox shell:
```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/nginxproxymanager.sh)"
```

## Run the container
For version of Docker Compose <code>≥ 2</code> use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open the web interface at <code>ht<span>tp://</span>192.168.1.100:81</code>.

::: info
The default credentials for the login are:
- Email address: <code>admin<span>@</span>example.com</code>
- Password: <code>changeme</code>
:::


## Configure SSL Certificate

::: warning
You must forward port <code>80</code> and <code>443</code> on your router before proceeding.
:::

Let's configure a new SSL Certificate provided by Cloudflare.

1. Go to <strong>SSL Certificates</strong> tab and add new <strong>Let's Encrypt Certificate</strong>:

    * Domain Names: <code>*.example.com</code>
    * Check <code>Use a DNS Challenge</code>
    * DNS Provider: <code>Cloudflare</code>
    * <strong>Credentials File Content</strong>:
        1. You have to go to your Cloudflare console and open your domain page. 
        2. On the rigth bar search for <strong>Get your API token</strong> and click it. 
        3. Next click <strong>Create Token</strong> and select <strong>Custom Token</strong>. 
        4. Type a name for the token and add permission <code>Zone</code> - <code>DNS</code> - <code>Edit</code>. 
        5. Now copy the token and paste it after 'dns_cloudflare_api_token =' .
    * Propagation Seconds: <code>empty</code>
    * Agree to the terms and click <strong>Save</strong>.

### Set default page

Go to <strong>Settings</strong> tab and change the default site to <code>404 Page</code>.

## Add new Host

We are going to set up the first DNS entry pointing to Nginx Proxy Manager installation.

1. First go to Cloudflare DNS page of your domain and add a new record:
    * Type: <code>CNAME</code>
    * Name: <code>proxy</code>
    * Target: <code>@</code>
    * Proxy status: <code>Proxied</code>

    ::: info
    You can change <code>proxy</code> value to anything you want.
    :::

2. Next, go to <strong>Host</strong> tab -> <strong>Proxy Host</strong> and create a new proxy host.

    <strong>Details</strong>
    * Domain names: type <code>proxy.example.com</code> and click enter.
    * Scheme: <code>http</code>
    * Forward Hostname / IP: <code>192.168.1.100</code>
    * Forward Port: <code>81</code>
    * Enable <code>Block Common Exploits</code> and <code>Websocket support</code>

    <strong>SSL</strong>
    * SSL Certificate: select the one created before: <code>*.example.com</code>
    * Enable <code>Force SSL</code> and <code>HTTP/2 Support</code>

3. Now you can click <strong>Save</strong>.
