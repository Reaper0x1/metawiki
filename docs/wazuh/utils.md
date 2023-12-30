# Utils

## Add/Remove group from Agent
The addition or removal of a group is managed by the Wazuh Manager.

To add a group run:
```bash
/var/ossec/bin/agent_groups -a -i <AGENT-ID> -g <GROUP-NAME>
```

To remove a group run:
```bash
/var/ossec/bin/agent_groups -r -i <AGENT-ID> -g <GROUP-NAME>
```