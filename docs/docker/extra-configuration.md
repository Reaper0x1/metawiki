# Extra Configuration

## Enable TCP port 2375 for external connection to Docker
To add a new remote environment to Portainer, all external docker machine must have port 2375 opened to be able to connect to the daemon.

Create <code>daemon.json</code> file in <code>/etc/docker</code>.
```json
{"hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]}
```

Create <code>/etc/systemd/system/docker.service.d/override.conf</code>:
```bash
mkdir /etc/systemd/system/docker.service.d
```
```bash
nano /etc/systemd/system/docker.service.d/override.conf
```
Paste this inside the <code>override.conf</code>
```text
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd
```

Reload the Systemd daemon:
```bash
systemctl daemon-reload
```

Restart Docker:
```bash
systemctl restart docker.service
```