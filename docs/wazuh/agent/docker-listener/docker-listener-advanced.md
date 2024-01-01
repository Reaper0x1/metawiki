# Docker Listener Advanced

## Agent endpoint configuration
::: tip Note
You need **root** user privileges to execute all the commands described below.
:::

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

4. Enable the Wazuh agent to receive remote commands from the Wazuh server. By default, remote commands are disabled in agents for security reasons.
    ```bash
    echo "logcollector.remote_commands=1" >> /var/ossec/etc/local_internal_options.conf
    ```

5. Restart the Wazuh agent to apply the above changes:
    ```bash
    systemctl restart wazuh-agent
    ```

## Wazuh server configuration
::: tip Note
You need **root** user privileges to execute all the commands described below.
:::

1. Create a Wazuh agent group called <code>container</code>:
    ```bash
    /var/ossec/bin/agent_groups -a -g container -q
    ```
2. Obtain the ID of all Wazuh agents using the following command:
    ```bash
    /var/ossec/bin/manage_agents -l
    ```
3. Assign the Wazuh agent hosting the Docker containers to the container group. Multiple agents can be assigned to the group. This ensures all agents running Docker containers in your environment receive the same configuration. 

    Replace <code><AGENT_ID></code> with the agent’s ID of the endpoint hosting the Docker container.
    ```bash
    /var/ossec/bin/agent_groups -a -i <AGENT_ID> -g container -q
    ```

4. Add the following settings to the <code>/var/ossec/etc/shared/container/agent.conf</code> configuration file. This enables the Docker listener module and sets the commands to execute on the monitored endpoint for Docker container information gathering.

    ```xml
    <agent_config>
    <!-- Configuration to enable Docker listener module. -->
    <wodle name="docker-listener">
        <interval>10m</interval>
        <attempts>5</attempts>
        <run_on_start>yes</run_on_start>
        <disabled>no</disabled>
    </wodle>  

    <!-- Command to extract container resources information. -->
    <localfile>
        <log_format>command</log_format>
        <command>docker stats --format "{{.Container}} {{.Name}} {{.CPUPerc}} {{.MemUsage}} {{.MemPerc}} {{.NetIO}}" --no-stream</command>
        <alias>docker container stats</alias>
        <frequency>120</frequency>
        <out_format>$(timestamp) $(hostname) docker-container-resource: $(log)</out_format>
    </localfile>

    <!-- Command to extract container health information. -->
    <localfile>
        <log_format>command</log_format>
        <command>docker ps --format "{{.Image}} {{.Names}} {{.Status}}"</command>
        <alias>docker container ps</alias>
        <frequency>120</frequency>
        <out_format>$(timestamp) $(hostname) docker-container-health: $(log)</out_format>
    </localfile>
    </agent_config>
    ```
    ::: tip Note
    The <code>\<frequency\></code> tag defines how often the command will be run in seconds. You can configure a value that suits your environment.
    :::

    The commands to extract information configured above can get logs like in the following samples:
    * Log for container resources:
    ```txt
    Nov  2 14:11:38 ubuntu-2204 docker-container-resource: ossec: output: 'docker container stats': bbc95edda452 nginx-container 21.32% 3MiB / 1.931GiB 0.15% 1.44kB / 0B
    ```
    * Log for container health::
    ```txt
    Nov  1 13:47:12 ubuntu-2204 docker-container-health: ossec: output: 'docker container ps': nginx nginx-container Up 48 minutes (healthy)
    ```

5. Create a decoders file <code>docker_decoders.xml</code> in the <code>/var/ossec/etc/decoders/</code> directory and add the following decoders to decode the logs received from the Wazuh agent:

    ```xml
    <!-- Decoder for container resources information. -->
    <decoder name="docker-container-resource">
    <program_name>^docker-container-resource</program_name>
    </decoder>

    <decoder name="docker-container-resource-child">
    <parent>docker-container-resource</parent>
    <prematch>ossec: output: 'docker container stats':</prematch>
    <regex>(\S+) (\S+) (\S+) (\S+) / (\S+) (\S+) (\S+) / (\S+)</regex>
    <order>container_id, container_name, container_cpu_usage, container_memory_usage, container_memory_limit, container_memory_perc, container_network_rx, container_network_tx</order>
    </decoder>

    <!-- Decoder for container health information. -->
    <decoder name="docker-container-health">
    <program_name>^docker-container-health</program_name>
    </decoder>

    <decoder name="docker-container-health-child">
    <parent>docker-container-health</parent>
    <prematch>ossec: output: 'docker container ps':</prematch>
    <regex offset="after_prematch" type="pcre2">(\S+) (\S+) (.*?) \((.*?)\)</regex>
    <order>container_image, container_name, container_uptime, container_health_status</order>
    </decoder>
    ```
    ::: warning
    The custom decoder file <code>docker_decoders.xml</code> might be removed during an upgrade. Ensure to back up the file before you perform upgrades.
    :::

6. Create a rules file <code>docker_rules.xml</code> in the <code>/var/ossec/etc/rules/</code> directory and add the following rules to alert the container information:
    ```xml
    <group name="container,">
    <!-- Rule for container resources information. -->
    <rule id="100100" level="5">
        <decoded_as>docker-container-resource</decoded_as>
        <description>Docker: Container $(container_name) Resources</description>
        <group>container_resource,</group>
    </rule>
    
    <!-- Rule to trigger when container CPU and memory usage are above 80%. -->
    <rule id="100101" level="12">
        <if_sid>100100</if_sid>
        <field name="container_cpu_usage" type="pcre2">^(0*[8-9]\d|0*[1-9]\d{2,})</field>
        <field name="container_memory_perc" type="pcre2">^(0*[8-9]\d|0*[1-9]\d{2,})</field>
        <description>Docker: Container $(container_name) CPU usage ($(container_cpu_usage)) and memory usage ($(container_memory_perc)) is over 80%</description>
        <group>container_resource,</group>
    </rule>

    <!-- Rule to trigger when container CPU usage is above 80%. -->
    <rule id="100102" level="12">
        <if_sid>100100</if_sid>
        <field name="container_cpu_usage" type="pcre2">^(0*[8-9]\d|0*[1-9]\d{2,})</field>
        <description>Docker: Container $(container_name) CPU usage ($(container_cpu_usage)) is over 80%</description>
        <group>container_resource,</group>
    </rule>  
    
    <!-- Rule to trigger when container memory usage is above 80%. -->
    <rule id="100103" level="12">
        <if_sid>100100</if_sid>
        <field name="container_memory_perc" type="pcre2">^(0*[8-9]\d|0*[1-9]\d{2,})</field>
        <description>Docker: Container $(container_name) memory usage ($(container_memory_perc)) is over 80%</description>
        <group>container_resource,</group>
    </rule>

    <!-- Rule for container health information. -->
    <rule id="100105" level="5">
        <decoded_as>docker-container-health</decoded_as>
        <description>Docker: Container $(container_name) is $(container_health_status)</description>
        <group>container_health,</group>
    </rule>
    
    <!-- Rule to trigger when a container is unhealthy. -->
    <rule id="100106" level="12">
        <if_sid>100105</if_sid>
        <field name="container_health_status">^unhealthy$</field>
        <description>Docker: Container $(container_name) is $(container_health_status)</description>
        <group>container_health,</group>
    </rule>
    </group>
    ```
    ::: warning
    The custom rules file <code>docker_rules.xml</code> might be removed during an upgrade. Ensure to back up the file before you perform upgrades.
    :::

7. Restart the Wazuh manager to apply the above changes:
    ```bash
    systemctl restart wazuh-manager
    ```

## Testing the configuration
To showcase the use cases mentioned above, Nginx, Redis, and Postgres images are used to create a containerized environment on the monitored endpoint.

1. Create and switch into a project directory <code>/container_env</code> for the container environment using the following command:
    ```bash
    mkdir container_env && cd $_
    ```
2. Create a Docker compose file <code>docker-compose.yml</code> and add the following configurations to it. The Docker compose file helps to manage multiple containers at once. The configuration performs the following Docker actions:
    * Pulls Nginx, Redis, and Postgres container images from Docker Hub.
    * Creates and starts <code>nginx-container</code>, <code>redis-container</code>, and <code>postgres-container</code> containers from the respective Docker images.
    * Creates and connects to a network called <code>container_env_network</code>.
    * Creates and mounts volumes <code>container_env_db</code> and <code>container_env_cache</code>.
    * Performs health checks on the created containers every three minutes.

    ```yml
    version: '3.8'

    services:
    db:
        image: postgres
        container_name: postgres-container
        restart: always
        environment:
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
        healthcheck:
        test: ["CMD-SHELL", "pg_isready"]
        interval: 3m
        timeout: 5s
        retries: 1
        ports:
        - '8001:5432'
        dns:
        - 8.8.8.8
        - 9.9.9.9
        volumes:
        - db:/var/lib/postgresql/data
        networks:
        - network
        mem_limit: "512M"

    cache:
        image: redis
        container_name: redis-container
        restart: always
        healthcheck:
        test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
        interval: 3m
        timeout: 5s
        retries: 1
        ports:
        - '8002:6379'
        dns:
        - 8.8.8.8
        - 9.9.9.9
        volumes:
        - cache:/data
        networks:
        - network
        mem_limit: "512M"

    nginx:
        image: nginx
        container_name: nginx-container
        restart: always
        healthcheck:
        test: ["CMD-SHELL", "stat /etc/nginx/nginx.conf || exit 1"]
        interval: 3m
        timeout: 5s
        retries: 1
        ports:
        - '8003:80'
        - '4443:443'
        dns:
        - 8.8.8.8
        - 9.9.9.9
        networks:
        - network
        mem_limit: "512M"

    volumes:
    db: {}
    cache: {}
    networks:
    network:
    ```

3. Execute the following command in the path containing the docker-compose.yml file to create and start the containers:
    ```bash
    sudo docker compose up -d
    ```
4. We use the <code>stress-ng</code> utility program to test for high CPU and memory utilization. Perform this test on one of the containers, for instance, the <code>nginx-container</code>. 
    * Execute the following commands to enter the container shell and install the stress-ng utility: 
    ```bash
    docker exec -it nginx-container /bin/bash
    ```
    ```bash
    apt update && apt install stress-ng -y
    ```
    * Execute the following command to trigger a high-level alert when both CPU and memory utilization exceeds 80%. The command runs for 3 minutes.
    ```bash
    stress-ng -c 1 -l 80 -vm 1 --vm-bytes 500m -t 3m
    ```
    * Execute the following command to trigger a high-level alert when memory usage exceeds 80%. The command runs for 3 minutes.
    ```bash
    stress-ng -vm 1 --vm-bytes 500m -t 3m
    ```
    * Execute the following command to trigger a high-level alert when CPU usage exceeds 80%. The command runs for 3 minutes.
    ```bash
    stress-ng -c 1 -l 80 -t 3m
    ```

5. The health check for the <code>nginx-container</code> verifies whether the configuration file <code>/etc/nginx/nginx.conf</code> exists. While inside the container shell, delete the configuration file to trigger a high-level alert when the container becomes unhealthy:
    ```bash
    rm /etc/nginx/nginx.conf
    ```

## Alert visualization
Visualize the triggered alerts by visiting the Wazuh dashboard.

* **Container actions alerts**: navigate to the **Discover** section and add the <code>rule.groups: docker</code> filter in the search bar to query the alerts. 

    Also, use the **Filter by type** search field and apply the <code>agent.name</code>, <code>data.docker.from</code>, <code>data.docker.Actor.Attributes.name</code>, <code>data.docker.Type</code>, <code>data.docker.Action</code>, and <code>rule.description</code>, filters. Save the query as Docker Events.
    ![An image](/img/wazuh/docker/docker-events-1.gif)








Reference guide <a href="https://wazuh.com/blog/docker-container-security-monitoring-with-wazuh/" target="_blank" rel="noreferrer">here</a>.