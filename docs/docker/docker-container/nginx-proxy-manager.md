# Nginx Proxy Manager <img src="/npm-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


The Nginx Proxy Manager conveniently manages proxy hosts for your web services, whether on your home network or otherwise.

::: info
The guide refers to the domain <strong>example.com</strong> and the local IP <strong>192.168.1.100</strong>, be sure to change them according to your configuration.
:::

## Installation
The installation requires Docker and Docker Compose installed. If you have not installed it please check this guide.

### Docker
Create the following docker-compose.yml:
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

::: warning
* If you want to change port make sure to change only the left one (<span style="color:orange"><strong>80</strong></span>:80).
* Update the volumes to your desired location (only left path).
:::

For version of Docker Compose ≥ 2 use the following command to create and start the container:
```bash
docker compose up -d
```
For older versions use:
```bash
docker-compose up -d
```

After initialization you can open whe web interface at <strong>ht<span>tp://</span>192.168.1.100:81</strong>.

::: info
The default credentials for the login are:
- Email address: <strong>admin<span>@</span>example.com</strong>
- Password: <strong>changeme</strong>
:::

## Configuration

::: warning
You must forward port <strong>80</strong> and <strong>443</strong> on your router before proceeding.
:::

### Create new SSL Certificate

Let's configure a new SSL Certificate provided by Cloudflare.

Go to <strong>SSL Certificates</strong> tab and add new <strong>Let's Encrypt Certificate</strong>:

* Domain Names: <strong>*.example.com</strong>
* Check <strong>Use a DNS Challenge</strong>
* DNS Provider: <strong>Cloudflare</strong>
* <strong>Credentials File Content</strong>:
    1. You have to go to your Cloudflare console and open your domain page. 
    2. On the rigth bar search for <strong>Get your API token</strong> and click it. 
    3. Next click <strong>Create Token</strong> and select <strong>Custom Token</strong>. 
    4. Type a name for the token and add permission <strong>Zone - DNS - Edit</strong>. 
    5. Now copy the token and paste it after 'dns_cloudflare_api_token =' .
* Propagation Seconds: <strong>120</strong>
* Agree to the terms and click <strong>Save</strong>.

### Set default page

Go to <strong>Settings</strong> tab and change the default site to <strong>404 Page</strong>.

### Add new Host

We are going to set up the first DNS entry pointing to Nginx Proxy Manager installation.

First go to Cloudflare DNS page of your domain and add a new record:
* Type: <strong>CNAME</strong>
* Name: <strong>proxy</strong>
* Target: <strong>@</strong>
* Proxy status: <strong>Proxied</strong>

::: info
You can change 'proxy' value to anything you want.
:::

Next, go to <strong>Host</strong> tab -> <strong>Proxy Host</strong> and create a new proxy host.

<strong>Details</strong>
* Domain names: type <strong>proxy.example.com</strong> and click enter.
* Scheme: <strong>http</strong>
* Forward Hostname / IP: <strong>192.168.1.100</strong>
* Forward Port: <strong>81</strong>
* Enable <strong>Cache Assets</strong>, <strong>Block Common Exploits</strong> and <strong>Websocket support</strong>.

<strong>SSL</strong>
* SSL Certificate: select the one created before: <strong>*.example.com</strong>.
* Enable <strong>Force SSL</strong> and <strong>HTTP/2 Support</strong>

Now you can click <strong>Save</strong>.
