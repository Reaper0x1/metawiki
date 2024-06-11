# 🛡️ Security

Defend your system and network!

## Networking
:::info [<img src="/adguard-icon.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/adguardhome) ‎ ‎ [Adguard Home](./services/adguardhome) <Badge type="warning" text="lxc" style=" position: relative; float: right;" />
AdGuard Home is a network-wide software for blocking ads & tracking.
:::
:::info [<img src="/fail2ban-icon.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/fail2ban) ‎ ‎ [Fail2ban](./services/fail2ban) <Badge type="tip" text="docker" style=" position: relative; float: right;" />
Fail2Ban scans log files like /var/log/auth.log and bans IP addresses conducting too many failed login attempts. It does this by updating system firewall rules to reject new connections from those IP addresses, for a configurable amount of time.
:::
:::info [<img src="/npm-icon.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/nginx-proxy-manager) ‎ ‎ [Nginx Proxy Manager](./services/nginx-proxy-manager) <Badge type="tip" text="docker" style=" position: relative; float: right;" /> <Badge type="warning" text="lxc" style=" position: relative; float: right;" />
The Nginx Proxy Manager is a reverse-proxy that conveniently manages proxy hosts for your web services, whether on your home network or otherwise.
:::

## Authentication
:::info [<img src="/authelia-icon.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/authelia) ‎ ‎ [Authelia](./services/authelia) <Badge type="tip" text="docker" style=" position: relative; float: right;" />
Authelia is an open-source authentication and authorization server and portal fulfilling the identity and access management (IAM) role of information security in providing multi-factor authentication and single sign-on (SSO) for your applications via a web portal. It acts as a companion for common reverse proxies.
:::
:::info [<img src="/authentik-icon2.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/authentik) ‎ ‎ [Authentik](./services/authentik) <Badge type="tip" text="docker" style=" position: relative; float: right;" />
Authentik is an open-source Identity Provider that emphasizes flexibility and versatility.
:::

## VPN
:::info [<img src="/wireguard-icon.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/wireguard) ‎ ‎ [Wireguard](./services/wireguard) <Badge type="warning" text="lxc" style=" position: relative; float: right;" />
Fast, modern, secure VPN tunnel. WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography.
:::
:::info [<img src="/gluetun-icon.png" width="35" height="35" style="display:inline-block; vertical-align: middle;">](./services/gluetun) ‎ ‎ [Gluetun](./services/gluetun) <Badge type="tip" text="docker" style=" position: relative; float: right;" />
VPN client in a thin Docker container for multiple VPN providers, written in Go, and using OpenVPN or Wireguard, DNS over TLS, with a few proxy servers built-in. 
:::