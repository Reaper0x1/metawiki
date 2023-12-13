# Nginx Proxy Manager

The Nginx Proxy Manager conveniently manages proxy hosts for your web services, whether on your home network or otherwise.

::: info
The guide refers to the domain <strong>example.com</strong> and the local IP <strong>192.168.1.100</strong>, be sure to change them according to your configuration.
:::

## Installation

Run the following command in the Proxmox shell:
```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/nginxproxymanager.sh)"
```

---

## Configuration

Login to the user interface at <strong>ht<span>tp://</span>ip-address:81</strong>.

Let's configure a new SSL Certificate provided by Cloudflare.

::: info
The default credentials for the web interface are:
- Email address: <strong>admin<span>@</span>example.com</strong>
- Password: <strong>changeme</strong>
:::

::: warning
You must forward port <strong>80</strong> and <strong>443</strong> on your router before proceeding.
:::

### Create new SSL Certificate

Go to <strong>SSL Certificates</strong> tab and add new Let's Encrypt Certificate:

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
* Forward Port<strong>81</strong>
* Enable <strong>Cache Assets</strong>, <strong>Block Common Exploits</strong> and <strong>Websocket support</strong>.

<strong>SSL</strong>
* SSL Certificate: select the one created before: <strong>*.example.com</strong>.
* Enable <strong>Force SSL</strong> and <strong>HTTP/2 Support</strong>

Now you can click <strong>Save</strong>.

---