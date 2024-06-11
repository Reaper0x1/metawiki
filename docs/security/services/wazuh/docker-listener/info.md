---
next: 'Simple Configuration | Docker Listener'
---
# Docker Listener Info

To maintain the security and compliance of your Docker environment, it is crucial to proactively monitor both your Docker server and containers. The Docker server is the backbone of your container infrastructure and manages the deployment of containers and resource allocation. By monitoring the Docker server, you can keep track of resource usage, unauthorized access attempts, performance issues, and other security concerns.

However, it is not enough to monitor only the Docker server, you also need to monitor the containers themselves. Container monitoring provides insight into the activities of your containers, such as network connections, file system changes, and process executions. Monitoring these activities helps to detect suspicious behavior, identify malware or malicious processes, and respond to security incidents in real-time.

By monitoring both the Docker server and the containers, you can proactively detect and respond to security threats, ensuring the security and compliance of your Docker environment to regulatory standards.

## Simple configuration
This method will listen for general docker events such as <code>pull</code>, <code>create</code>, <code>start</code>, <code>mount</code>, <code>connect</code>, <code>exec_start</code>, <code>detach</code>, <code>die</code>, <code>exec_create</code>, <code>exec_detach</code>, etc.

[Go to simple configuration](./simple)

## Advanced configuration
With the advanced configuration you can:
* Monitor Docker events such as <code>pull</code>, <code>create</code>, <code>start</code>, <code>mount</code>, <code>connect</code>, <code>exec_start</code>, <code>detach</code>, <code>die</code>, <code>exec_create</code>, <code>exec_detach</code>, etc.
* Monitor Docker container resources such as CPU, memory, and network traffic utilization.
* Detect when container CPU and memory usage exceed predefined thresholds.
* Monitor the health status and uptime of Docker containers.

[Go to advanced configuration](./advanced)