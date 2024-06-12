# <img src="/crowdsec-icon.png" width="40" height="40" style="display:inline-block; vertical-align: middle; margin-right: 10px">Crowdsec <Badge type="info" text="system" style=" position: relative; float: right;" />

Crowdsec is an open-source, lightweight software, detecting peers with aggressive behaviors to prevent them from accessing your systems.

Proactively block known malicious IPs to avoid service downtime and potential data losses that can lead to a significant loss in revenue and customer trust, as well as regulatory fines.

Proactively block offensive IP addresses and make sure your servers dedicate all their resources to serving customers rather than attackers.

Filter out background noise to reduce the number of security alerts at the SOC level by 80% and allow your security experts to focus on critical security events.

## Installation

:::info
This will install both the <code>Security Engine</code> and the <code>Bouncer</code>.
:::

1. Create an account on <a href="https://www.crowdsec.net/" target="_blank" rel="noreferrer">Crowdsec.net</a>.

2. Run the following command inside each LXC container:
    ```bash
    bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/misc/crowdsec.sh)"

    ```
3. Inside <code>Security Engines</code> tab, click <code>Add Security Agent</code>
4. Copy the <code>enroll</code> command from the bottom of the page and run it inside each container.
5. Go back on the website, click agents and accept the enrollment.
6. Restart crowdsec:
    ```bash
    systemctl restart crowdsec
    ```

