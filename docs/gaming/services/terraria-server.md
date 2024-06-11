# Terraria Server <img src="/terraria-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-left:10px;">


Blending elements of classic action games with the freedom of sandbox-style creativity, Terraria is a unique gaming experience where both the journey and the destination are as unique as the players themselves!

::: info
The guide refers to the domain <code>example.com</code> and the local IP <code>192.168.1.201</code>, be sure to change them according to your configuration.
:::

## Docker
The installation requires Docker installed. If you have not installed it please check [this guide](/docker/install.md).

::: warning
Using Docker Compose is not recommended as it could lead to bugs and problems with the terminal.
:::

Firstly you need to create a world. Next put the <code>.wld</code> file of your world inside your config folder<code>path-to-config-folder</code>.

Run the following command:
```bash
docker run -i -d -p 7777:7777 -v /path-to-config-folder:/root/.local/share/Terraria/Worlds --name="tshock" ryshe/terraria:tshock-1.4.4.9-5.2.0-3 -world /root/.local/share/Terraria/Worlds/<world-name>.wld
```

::: info
* If you want to change <code>port</code> make sure to change only the left one (<span style="color:orange"><strong>7777</strong></span>:7777).
* Update <code>path-to-config-folder</code> to your desired location for configuration files.
* Match the <code>world-name</code> with your world file name.
:::

Now your server will start up.
Next you can join the server with:
* IP: <code>192.168.1.201</code>
* Port: <code>7777</code>

## Configuration
Now you can configure your server by editing the <code>config.json</code> file inside your config folder.

These are the recommended changes to do:
* ServerPassword: <code>set a password</code>
* AutoSave: <code>true</code>
* SpawnProtection: <code>false</code>
* AllowCrimsonCreep: <code>false</code>
* AllowCorruptionCreep: <code>false</code>
* AllowHallowCreep: <code>false</code>

These config are used to avoid being blocked by the anti cheat when there are multiple players online:
* MaxDamage: <code>1000000</code>
* MaxProjDamage: <code>1000000</code>
* ProjectileThreshold: <code>1000000</code>
* HealOtherThreshold: <code>1000000</code>

## Access the console
An easy way to access the console is to install **socat**:
```bash
sudo apt install socat
```

Next you can run any command with the syntax:
```bash
echo '/say Hello from the console' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
```
::: info
Make sure to change <code>tshock</code> with the name of your Terraria container if changed in the run command above.
:::

## Auto restart
If you want to auto restart the server at given time you can follow the next steps.

### Create the script
Create a <code>restart.sh</code> file and paste the following code:
```bash
#!/bin/bash

echo "--------------------------------------" >> /log-folder/restart-logs.log

echo '/say Server restarting in 30 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 30 minutes" >> /log-folder/restart-logs.log 
sleep 900

echo '/say Server restarting in 15 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 15 minutes" >> /log-folder/restart-logs.log 
sleep 300

echo '/say Server restarting in 10 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 10 minutes" >> /log-folder/restart-logs.log 
sleep 300

echo '/say Server restarting in 5 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 5 minutes" >> /log-folder/restart-logs.log 
sleep 60

echo '/say Server restarting in 4 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 4 minutes" >> /log-folder/restart-logs.log 
sleep 60

echo '/say Server restarting in 3 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 3 minutes" >> /log-folder/restart-logs.log 
sleep 60

echo '/say Server restarting in 2 minutes' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 2 minutes" >> /log-folder/restart-logs.log 
sleep 60

echo '/say Server restarting in 1 minute' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 1 minute" >> /log-folder/restart-logs.log 

sleep 30

echo '/save' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Saving the world" >> /log-folder/restart-logs.log 

sleep 20

echo '/say Server restarting in 10 seconds' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
echo "$(date): Server restarting in 10 seconds" >> /log-folder/restart-logs.log 

sleep 5

echo '/say Restarting in 5...' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
sleep 1
echo '/say Restarting in 4...' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
sleep 1
echo '/say Restarting in 3...' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
sleep 1
echo '/say Restarting in 2...' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
sleep 1
echo '/say Restarting in 1...' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN
sleep 1

echo "$(date): Restarting the server" >> /log-folder/restart-logs.log 
echo '/exit' | /usr/bin/socat EXEC:'docker attach tshock',pty STDIN

sleep 60

/usr/bin/docker start tshock
echo "$(date): Server restarted" >> /log-folder/restart-logs.log

```

These script will alert the online player about the incoming restart 30 minute ahead. The same for the next 15, 10, 5, 4, 3, 2, 1 minutes.
It logs everything in a file, so make sure to change <code>log-folder</code> to your desired location.

Depending on your system you may need to adjust the paths to the various binaries, for example <code>/usr/bin/docker</code>. Make sure that binaries exist. If not chage accordingly (you can use the command <code>which docker</code> to know the exact location).

Make the file executable:
```bash
chmod +x ./restart.sh
```

### Add cron schedule
Now you need to add a **cron** job. Edit the crontable:
```bash
crontab -e
```

Now add the line:
```text
30 0,3,6,9,12,15,18,21 * * *    /bin/bash /script-folder/restart.sh
```

The schedule will restart the server every three hours from 00:30.
Change your <code>script-folder</code> accordingly.

You can generate crontab schedule at <a href="https://crontab.guru/" target="_blank" rel="noreferrer">crontab.guru</a>.

Now save and reboot the server.