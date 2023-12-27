# :gear: General config

## VM and CT conventions
- <strong>[100-199]</strong> -> Main
- <strong>[400-499]</strong> -> Developement
- <strong>[500-550]</strong> -> Windows
- <strong>[800-899]</strong> -> Test
- <strong>[900-999]</strong> -> Template

## Edit LXC Configuration
```bash
nano /etc/pve/lxc/<LXC_NUMBER>.conf
```

## Enable Tun Interface
Edit the LXC configuration file like above.
Add those lines:
```txt
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net dev/net none bind,create=dir
```
Now start/restart the container.

This guide assumes that the container is privileged.

Full guide <a href="https://pve.proxmox.com/wiki/OpenVPN_in_LXC" target="_blank" rel="noreferrer">here</a>.