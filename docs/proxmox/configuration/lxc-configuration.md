# LXC Configuration

## Edit LXC Configuration
From the host, edit the file:
```bash
nano /etc/pve/lxc/<LXC_NUMBER>.conf
```

## Add bindmount to LXC container
Prerequisites:
- A data folder on the host you want to access from the container: <code>/mnt/storage</code> for example
- An existing folder where to mount the folder: <code>/mnt/storage-data</code> in this case

On the host, edit the configuration <code>/etc/pve/lxc/<LXC_NUMBER>.conf</code> file of the LXC container and add the line:
```txt
mp0: /mnt/storage-data,mp=/mnt/storage
```

This will mount the <code>/mnt/storage</code> folder of the host to the location <code>/mnt/storage-data</code> on the LXC container.

Save the configuration and reboot the container.

:::info
There are two possible cases to keep in mind:
- If the container is **privileged** you have no problem reading and writing file inside the mounted folder on the container (for example as root).
- If the container is **unprivileged** the files are read-only. To be able to read and write new file you need to follow a different approach as described [below](#bindmount-unprivileged-lxc-container).
:::

## Bindmount unprivileged LXC container

### How the mapping works
Before proceeding, it is necessary to understand how the mapping of users and groups between the host and an LXC container works.

This is how to calculate the id of the owner of the files on the host: <code>100000 + LXC_ID</code>.

For example, if inside the container a user/group has <code>id = 1000</code>, this will be mapped to the host with <code>id = 101000</code>.

### Bindmount a folder to a unprivileged container
In this example the host folder <code>/mnt/storage</code> will be mounted to <code>/mnt/storage-data</code> on the container.

1. First of all we need to install the <code>acl</code> tool on the **host**:

    ```bash
    apt install acl
    ``` 

    To enable acl with ZFS run:
    ```bash
    zfs set acltype=posixacl <pool_path>
    ``` 

    For performance run:
    ```bash
    zfs set xattr=sa <pool_path>
    ```

    You can list all your zfs pool with the <code>zfs list</code> command.

2. Next we need to change the owner of the folder on the **host**:

    ```bash
    chown -R 101000:101000 /mnt/storage
    ```

    Change the folder permissions:
    ```bash
    chmod -R 2770 /mnt/storage
    ```

    This way, any new files created inside the directory will belong to the 101000 group on the host and have rwx group permissions, directories will have rws permissions.

    The <code>770</code> permission gives read/write/execute permissions to both the owner and the group, with no permissions are give tho others.

3. Create user and group inside the **container**:

    Inside containers, create a <code>hostwrite</code> group, and set the GID.
    ```bash
    addgroup --gid 1000 hostwrite
    ```

    If not present, on the container create a user that need access to the files:
    ```bash
    adduser <user>
    ```

    Add container users to the hostwrite group as necessary:
    ```bash
    usermod -aG hostwrite <user>
    ```

4. Set the default ACLs for the group and other ont he **host**:

    ```bash
    setfacl -Rm g:101000:rwx,d:g:101000:rwx,o::0 /mnt/storage
    ```

    What this does is ensure that the <code>/mnt/storage</code> folder (and subfolders) get write permissions for GID 101000 (mapped to the hostwrite group on the guest), and that the default ACL for new files and folders is also allows GID 101000 access.

5. Reboot the container.

Now, new files create in the container have the UID associated with the container user but they all belong to the homeusers group.

:::info
To remove recursively all acls from a folder run the following command: <code>setfacl -b -R /folder</code>
:::

### Docker
If you are running docker inside the container, you need to run the container as the user created before:

- Docker Run
    ```yml
    -e PUID=1000 -e PGID=1000
    ```
- Docker Compose
    ```yml
    environment:
        - PUID=1000
        - PGID=1000
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