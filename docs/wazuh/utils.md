---
prev: 'Advanced Configuration | Docker Listener'
---
# Utils

## List agents <Badge type="tip" text="manager" />
```bash
/var/ossec/bin/manage_agents -l
```

## Create / Delete group <Badge type="tip" text="manager" />
To create a group run:
```bash
/var/ossec/bin/agent_groups -a -g <GROUP-NAME>
```

To delete a group run:
```bash
/var/ossec/bin/agent_groups -r -g <GROUP-NAME>
```

## Add / Remove group from agent <Badge type="tip" text="manager" />
The addition or removal of a group is managed by the Wazuh Manager.

To add a group run:
```bash
/var/ossec/bin/agent_groups -a -i <AGENT-ID> -g <GROUP-NAME>
```

To remove a group run:
```bash
/var/ossec/bin/agent_groups -r -i <AGENT-ID> -g <GROUP-NAME>
```