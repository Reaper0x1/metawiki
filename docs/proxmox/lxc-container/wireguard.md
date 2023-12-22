# Wireguard <img src="/wireguard-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">

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

To fix the error, edit the configuration on your client:
```txt{4}
[Peer]
PublicKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PresharedKey = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AllowedIPs = 0.0.0.0/0, ::/0, 192.168.1.0/24
Endpoint = xxx.xxx.xxx.xxx:51820
PersistentKeepalive = 25
```
You need to add <code>192.168.1.0/24</code> (CIDR notation) to <code>AllowedIPs</code>. Make sure that the IP matches your local network.

[go](http://stackoverflow.com){:target="_blank" rel="noopener"}