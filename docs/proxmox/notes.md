# Notes

## Mount local drive to LXC Container

Go to your proxmox shell and run:
```bash
nano /etc/pve/lxc/ID.conf
```
::: warning
Make sure to replace <code>ID</code> with the target container id.
:::

Add the following line:
```text
mp0: /mnt/storage-data/share,mp=/mnt/storage
```
::: warning
Replace <code>/mnt/storage-data/share</code> with the Proxmox host mount point of the disk and <code>/mnt/storage</code> with the desired mapping on the container.
:::

## Mount SMB Folder to LXC Container using cifs

::: warning
Inside LXC Container
:::

```bash
sudo apt-get install cifs-utils
```

Edit /etc/fstab and add your entry:
```text
//server/share /pathto/mountpoint cifs credentials=/home/username/.smbcredentials,uid=shareuser,gid=sharegroup 0 0
```

Create the .smbcredentials file in your home directory:
```text
username=shareuser
password=sharepassword
```

Make sure you secure your ~/.smbcredentials file:
```bash
chmod 0600 ~/.smbcredentials
```

Finally, test the mount with:
```bash
sudo mount -a
```

<a href="https://askubuntu.com/questions/157128/proper-fstab-entry-to-mount-a-samba-share-on-boot" target="_blank" rel="noreferrer">Source</a>

## Unprivileged LXC Mount Cifs Shares

https://forum.proxmox.com/threads/tutorial-unprivileged-lxcs-mount-cifs-shares.101795/

## Plex
https://www.reddit.com/r/Proxmox/comments/uvkp1r/need_help_cant_let_plex_access_files_on_an/

https://www.reddit.com/r/Proxmox/comments/i6xdgg/plex_docker_readwrite_for_samba_share/

https://www.reddit.com/r/Proxmox/comments/vz1fwy/plex_inside_lxc_container_dont_see_host_mount/

## Mount folder to VM
https://forum.proxmox.com/threads/add-mountpoint-to-virtual-machine.80941/