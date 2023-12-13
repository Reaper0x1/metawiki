# Nginx Proxy Manager

The Nginx Proxy Manager conveniently manages proxy hosts for your web services, whether on your home network or otherwise.

---

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
    

---