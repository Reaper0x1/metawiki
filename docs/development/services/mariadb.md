# <img src="/mariadb-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">MariaDB <Badge type="warning" text="lxc" style=" position: relative; float: right;" />

MariaDB Server is one of the most popular open source relational databases.

## Installation

Run the following command in the Proxmox shell:
```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/mariadb.sh)"
```

## Configuration

Inside MariaDB container run:
```bash
mysql_secure_installation
```
Insert your root password and set this values:
```bash
Enter current password for root (enter for none): enter

Switch to unix_socket authentication [Y/n]: y

Change the root password? [Y/n]: n

Remove anonymous users? [Y/n]: y

Disallow root login remotely? [Y/n]: y

Remove test database and access to it? [Y/n]: y

Reload privilege tables now? [Y/n]: y
```

We will create a new account called <code>admin</code> with the same capabilities as the root account, but configured for password authentication.
```bash
mysql
```

Prompt will change to <code>MariaDB [(none)]></code>.

Create a new local admin (Change the username and password to match your preferences):
```sql
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
```

Give local admin root privileges (Change the username and password to match above):
```sql
GRANT ALL ON *.* TO 'admin'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;
```

Now, we'll give the user admin root privileges and password-based access that can connect from anywhere on your local area network (LAN), which has addresses in the subnet 192.168.1.0/24. This is an improvement because opening a MariaDB server up to the Internet and granting access to all hosts is bad practice.. Change the username, password and subnet to match your preferences:
```sql
GRANT ALL ON *.* TO 'admin'@'192.168.1.%' IDENTIFIED BY 'password' WITH GRANT OPTION;
```

Flush the privileges to ensure that they are saved and available in the current session:
```sql
FLUSH PRIVILEGES;
```

Now exit the mariadb shell:
```sql
exit
```

Log in as the new database user you just created:
```bash
mysql -u admin -p
```

⚠️ Reboot the container.

Checking status:
```bash
systemctl status mariadb
```