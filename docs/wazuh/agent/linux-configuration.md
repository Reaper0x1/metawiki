# Linux Configuration

## Dependecies 
Make sure to have <code>lsb-release</code> installed on your system:
```bash
apt install lsb-release
```

## Install

To install Wazuh agent on Linux run the following commands.

1. For DEB amd64:
    ```bash
    wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.1-1_amd64.deb && WAZUH_MANAGER='192.168.1.106' WAZUH_AGENT_GROUP='metaserver' WAZUH_AGENT_NAME='test' dpkg -i ./wazuh-agent_4.7.1-1_amd64.deb
    ```
    ::: info
    * Replace <code>WAZUH_MANAGER</code> with the IP address of your manager.
    * Replace <code>WAZUH_AGENT_GROUP</code> with your chosen group.
    * Replace <code>WAZUH_AGENT_NAME</code> with the name of the agent.
    :::

2. Start the Wazuh agent:
    ```bash
    systemctl daemon-reload
    systemctl enable wazuh-agent
    systemctl start wazuh-agent
    ```