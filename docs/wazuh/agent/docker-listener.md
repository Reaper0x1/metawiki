# Docker Listener

To maintain the security and compliance of your Docker environment, it is crucial to proactively monitor both your Docker server and containers. The Docker server is the backbone of your container infrastructure and manages the deployment of containers and resource allocation. By monitoring the Docker server, you can keep track of resource usage, unauthorized access attempts, performance issues, and other security concerns.

However, it is not enough to monitor only the Docker server, you also need to monitor the containers themselves. Container monitoring provides insight into the activities of your containers, such as network connections, file system changes, and process executions. Monitoring these activities helps to detect suspicious behavior, identify malware or malicious processes, and respond to security incidents in real-time.

By monitoring both the Docker server and the containers, you can proactively detect and respond to security threats, ensuring the security and compliance of your Docker environment to regulatory standards.

## Enable the Wazuh Docker listener
The Docker listener allows the Wazuh agent to capture Docker events and forward them to the Wazuh server. The following sections describe how to install the Python Docker module and enable the Wazuh Docker listener.

### Install dependencies on the Docker server
1. Install Python3:
    ```bash
    apt-get update && apt-get install python3
    ```

2. Install Pip on Debian-based endpoints:    
    ```bash
    apt-get install python3-pip
    ```

3. Install the Python <code>docker</code> module. The Wazuh Docker listener requires docker <code>4.2.0</code>.
    ```bash
    pip3 install docker==4.2.0
    ```

    If you are running wazuh agent on LXC container you need to run the following command:
    
    ```bash
    pip3 install docker==4.2.0 --break-system-packages
    ```

### Configure the Wazuh agent
Perform the following steps on the Docker server to configure the Wazuh agent to forward Docker events to the Wazuh server.

1. Add the following configuration to the Wazuh agent configuration file <code>/var/ossec/etc/ossec.conf</code> to enable the Docker listener:
    ```bash
    nano /var/ossec/etc/ossec.conf
    ```
    ```conf
    <ossec_config>
     <wodle name="docker-listener">
        <interval>10m</interval>
        <attempts>5</attempts>
        <run_on_start>yes</run_on_start>
        <disabled>no</disabled>
     </wodle>
    </ossec_config>
    ```

2. Restart the Wazuh agent to apply the changes:

    ```bash
    systemctl restart wazuh-agent
    ```

3. Check if the listener works with:

    ```bash
    tail -f  /var/ossec/logs/ossec.log | grep docker
    ```

## Test the configuration
Perform several Docker activities like pulling a Docker image, starting an instance, running some other Docker commands, and then deleting the container.
1. Pull an image, such as the NGINX image, and run a container:
    ```bash
    sudo docker pull nginx
    sudo docker run -d -P --name nginx_container nginx
    sudo docker exec -it nginx_container cat /etc/passwd
    sudo docker exec -it nginx_container /bin/bash
    exit
    ```

2. Stop and remove the container:

    ```bash
    sudo docker stop nginx_container
    sudo docker rm nginx_container
    ```