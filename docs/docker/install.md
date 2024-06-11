# Install Docker

This guide provide you with the info necessary for installing Docker and Docker compose.

## Add Docker repository

1. Run the commands below as root:

    ```bash
    apt-get update
    ```

    ```bash
    apt-get install ca-certificates curl gnupg
    ```

    ```bash
    install -m 0755 -d /etc/apt/keyrings
    ```

2. Download Docker key:  

    **Debian**:
    ```bash
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    ```

    **Ubuntu**:
    ```bash
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    ```


3. Change permission of docker key:
    ```bash
    chmod a+r /etc/apt/keyrings/docker.gpg
    ```  

4. Add Docker repository:

    **Debian**:

    ```bash
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```

    **Ubuntu**:
    ```bash
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    ```


5. Now refresh the repository:
    ```bash
    apt-get update
    ```

## Install Docker and Docker Compose
Run the following command as root:
```bash
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Check Docker installation
Run the following command as root:
```bash
docker ps
```