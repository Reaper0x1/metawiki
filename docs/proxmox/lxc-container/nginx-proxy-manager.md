# Nginx Proxy Manager <img src="/npm-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">

The Nginx Proxy Manager conveniently manages proxy hosts for your web services, whether on your home network or otherwise.

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.100</code>, be sure to change them according to your configuration.
:::

## Installation

Run the following command in the Proxmox shell:
```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/nginxproxymanager.sh)"
```

After installation you can start the container and open the web interface at <code>ht<span>tp://</span>192.168.1.100:81</code>.

::: info
The default credentials for the login are:
- Email address: <code>admin<span>@</span>example.com</code>
- Password: <code>changeme</code>
:::

## Create new SSL Certificate
::: warning
You must forward port <code>80</code> and <code>443</code> on your router before proceeding.
:::

Let's configure a new SSL Certificate provided by Cloudflare.

Go to <strong>SSL Certificates</strong> tab and add new <strong>Let's Encrypt Certificate</strong>:

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

First go to Cloudflare DNS page of your domain and add a new record:
* Type: <code>CNAME</code>
* Name: <code>proxy</code>
* Target: <code>@</code>
* Proxy status: <code>Proxied</code>

::: info
You can change <code>proxy</code> value to anything you want.
:::

Next, go to <strong>Host</strong> tab -> <strong>Proxy Host</strong> and create a new proxy host.

<strong>Details</strong>
* Domain names: type <code>proxy.example.com</code> and click enter.
* Scheme: <code>http</code>
* Forward Hostname / IP: <code>192.168.1.100</code>
* Forward Port: <code>81</code>
* Enable <code>Cache Assets</code>, <code>Block Common Exploits</code> and <code>Websocket support</code>

<strong>SSL</strong>
* SSL Certificate: select the one created before: <code>*.example.com</code>
* Enable <code>Force SSL</code> and <code>HTTP/2 Support</code>

Now you can click <strong>Save</strong>.

---