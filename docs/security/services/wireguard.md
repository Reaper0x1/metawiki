# <img src="/wireguard-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Wireguard <Badge type="warning" text="lxc" style=" position: relative; float: right;" />
Fast, modern, secure VPN tunnel. WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography.

## Installation

Run the following command in the Proxmox shell:
```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/wireguard.sh)"
```

## Configuration

Host configuration:
```bash
nano /etc/pivpn/wireguard/setupVars.conf
```

## Add Clients
To add a client run the following command:
```bash
pivpn add
```
This will generate a <code>.conf</code> file.


To generate the <code>QR code</code> of a client configuration, run the command:
```bash
pivpn -qr
```

## Fix ERR_NETWORK_ACCESS_DENIED error
If you want to connect to local IP addresses of your host network you can get the error <code>ERR_NETWORK_ACCESS_DENIED</code>.

1. To fix the error, edit the configuration on your client:
```txt{4}
[Peer]
PublicKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PresharedKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AllowedIPs = 0.0.0.0/0, ::/0, 192.168.1.0/24
Endpoint = xxx.xxx.xxx.xxx:51820
PersistentKeepalive = 25
```
2. You need to add <code>192.168.1.0/24</code> (<a href="https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" target="_blank" rel="noreferrer">CIDR</a> notation) to <code>AllowedIPs</code>. Make sure that the IP matches your local network.