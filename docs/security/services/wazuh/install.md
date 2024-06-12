# <img src="/wazuh-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Wazuh <Badge type="info" text="system" style=" position: relative; float: right;" />

Wazuh is a free and open source security platform that unifies XDR and SIEM protection for endpoints and cloud workloads.

Wazuh provides analysts real-time correlation and context. Active responses are granular, encompassing on-device remediation so endpoints are kept clean and operational.

The Wazuh Security Information and Event Management (SIEM) solution provides monitoring, detection, and alerting of security events and incidents.

## Requirements

### Hardware

| Agents     | CPU    | RAM  | 
| ---------- | ----   | ---- |
| 1-25       | 4 vCPU | 50 GB |
| 25-50      | 8 vCPU | 100 GB |
| 50-100     | 8 vCP  | 200 GB |

### Operating SYstem


- Amazon Linux 2
- CentOS 7, 8
- Red Hat Enterprise Linux 7, 8, 9
- Ubuntu 16.04, 18.04, 20.04, 22.04

## Install
1. Download and run the Wazuh installation assistant.
    ```bash
    curl -sO https://packages.wazuh.com/4.8/wazuh-install.sh && sudo bash ./wazuh-install.sh -a

    ```
    Once the assistant finishes the installation, the output shows the access credentials and a message that confirms that the installation was successful.

    ```bash{4}
    INFO: --- Summary ---
    INFO: You can access the web interface https://<wazuh-dashboard-ip>
        User: admin
        Password: <ADMIN_PASSWORD>
    INFO: Installation finished.
    ```
2. Access the Wazuh web interface with <code>https://wazuh-ip:443</code> and your credentials:
    - Username: <code>admin</code>
    - Password: <code>\<ADMIN_PASSWORD\></code>

## Wazuh indexer tuning
### Memory locking

When the system is swapping memory, the Wazuh indexer may not work as expected. Therefore, it is important for the health of the Wazuh indexer node that none of the Java Virtual Machine (JVM) is ever swapped out to disk. To prevent any Wazuh indexer memory from being swapped out, configure the Wazuh indexer to lock the process address space into RAM as follows.

1. Add the below line to the <code>/etc/wazuh-indexer/opensearch.yml</code> configuration file on the Wazuh indexer to enable memory locking:
    ```bash
    bootstrap.memory_lock: true
    ```
2. Modify the limit of system resources. Configuring system settings depends on the operating system of the Wazuh indexer installation.

    1. Create a new directory for the file that specifies the system limits:
        ```bash
        mkdir -p /etc/systemd/system/wazuh-indexer.service.d/
        ```
    2. Run the following command to create the <code>wazuh-indexer.conf</code> file in the newly created directory with the new system limit added:
        ```bash
        cat > /etc/systemd/system/wazuh-indexer.service.d/wazuh-indexer.conf << EOF
        [Service]
        LimitMEMLOCK=infinity
        EOF
        ```
3. Edit the <code>/etc/wazuh-indexer/jvm.options</code> file and change the JVM flags. Set a Wazuh indexer heap size value to limit memory usage. JVM heap limits prevent the <code>OutOfMemory</code> exception if the Wazuh indexer tries to allocate more memory than is available due to the configuration in the previous step. The recommended value is half of the system RAM. For example, set the size as follows for a system with 8 GB of RAM.
    ```bash
    -Xms4g
    -Xmx4g
    ```

    Where the total heap space:
    - <code>-Xms4g</code> - initial size is set to 4Gb of RAM.
    - <code>-Xmx4g</code> - maximum size is to 4Gb of RAM
    :::warning
    To prevent performance degradation due to JVM heap resizing at runtime, the minimum (Xms) and maximum (Xmx) size values must be the same
    :::
4. Restart the Wazuh indexer service:
    ```bash
    systemctl daemon-reload
    systemctl restart wazuh-indexer
    ```
5. Verify that the setting was changed successfully, by running the following command to check that <code>mlockall</code> value is set to <code>true</code>:
    ```bash
    curl -k -u <INDEXER_USERNAME>:<INDEXER_PASSWORD> "https://<INDEXER_IP_ADDRESS>:9200/_nodes?filter_path=**.mlockall&pretty"
    ```

    Output:
    ```bash
    {
      "nodes" : {
        "sRuGbIQRRfC54wzwIHjJWQ" : {
          "process" : {
            "mlockall" : true
          }
        }
      }
    }
    ```
    If the output is <code>false</code>, the request has failed, and the following line appears in the <code>/var/log/wazuh-indexer/wazuh-indexer.log</code> file:
    ```bash
    Unable to lock JVM Memory
    ```