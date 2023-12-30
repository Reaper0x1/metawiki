import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: "en-US",
  title: "Metawiki",
  description: "Self hosted server wiki",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  lastUpdated: true,
  appearance: "dark",

  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      {
        text: "Info",
        link: "/info",
      },
      {
        text: "Proxmox",
        items: [
          { text: "Get started", link: "/proxmox/get-started" },
          { text: "Install", link: "/proxmox/installation" },
          { text: "Configuration", link: "/proxmox/general-config" },
          {
            text: "External Drive",
            link: "/proxmox/external-drive-configuration",
          },
          {
            text: "LXC Container",
            items: [
              {
                text: "AdGuard Home",
                link: "/proxmox/lxc-container/adguardhome",
              },
              {
                text: "MariaDB",
                link: "/proxmox/lxc-container/mariadb",
              },
              {
                text: "Nginx Proxy Manager",
                link: "/proxmox/lxc-container/nginx-proxy-manager",
              },
              {
                text: "Wireguard",
                link: "/proxmox/lxc-container/wireguard",
              },
            ],
          },
          { text: "Notes", link: "/proxmox/notes" },
        ],
      },
      {
        text: "Docker",
        items: [
          { text: "Install Docker", link: "/docker/docker.md" },
          {
            text: "Docker Container",
            items: [
              { text: "Authelia", link: "/docker/docker-container/authelia" },
              { text: "Authentik", link: "/docker/docker-container/authentik" },
              { text: "Deluge", link: "/docker/docker-container/deluge" },
              { text: "Fail2Ban", link: "/docker/docker-container/fail2ban" },
              {
                text: "FireflyIII",
                link: "/docker/docker-container/fireflyiii",
              },
              { text: "Gluetun", link: "/docker/docker-container/gluetun" },
              {
                text: "Homepage",
                link: "/docker/docker-container/homepage",
              },
              { text: "Netdata", link: "/docker/docker-container/netdata" },
              { text: "Nextcloud", link: "/docker/docker-container/nextcloud" },
              {
                text: "Nginx Proxy Manager",
                link: "/docker/docker-container/nginx-proxy-manager",
              },
              {
                text: "phpMyAdmin",
                link: "/docker/docker-container/phpmyadmin",
              },
              {
                text: "Plex Media Server",
                link: "/docker/docker-container/plex-media-server",
              },
              { text: "Prowlarr", link: "/docker/docker-container/prowlarr" },
              {
                text: "qBittorrent",
                link: "/docker/docker-container/qbittorrent",
              },
              { text: "Radarr", link: "/docker/docker-container/radarr" },
              { text: "VS Code", link: "/docker/docker-container/vs-code" },
              {
                text: "Whats Up Docker",
                link: "/docker/docker-container/whats-up-docker",
              },
            ],
          },
          {
            text: "Extra Configuration",
            link: "/docker/extra-configuration.md",
          },
        ],
      },
      {
        text: "Wazuh",
        items: [
          { text: "Install", link: "/wazuh/install" },
          { text: "Configuration", link: "/wazuh/configuration" },
          {
            text: "Agents",
            items: [
              {
                text: "Linux Configuration",
                link: "/wazuh/agent/linux-configuration",
              },
              {
                text: "Docker Listener",
                link: "/wazuh/agent/docker-listener",
              },
            ],
          },
          { text: "Utils", link: "/wazuh/utils" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Info",
        link: "/info",
      },
      {
        text: "Proxmox",
        collapsed: false,
        items: [
          { text: "Get started", link: "/proxmox/get-started" },
          { text: "Install", link: "/proxmox/installation" },
          {
            text: "Configuration",
            link: "/proxmox/general-config",
          },
          {
            text: "External Drive",
            link: "/proxmox/external-drive-configuration",
          },
          {
            text: "LXC Container",
            collapsed: true,
            items: [
              {
                text: "AdGuard Home",
                link: "/proxmox/lxc-container/adguardhome",
              },
              {
                text: "MariaDB",
                link: "/proxmox/lxc-container/mariadb",
              },
              {
                text: "Nginx Proxy Manager",
                link: "/proxmox/lxc-container/nginx-proxy-manager",
              },
              {
                text: "Wireguard",
                link: "/proxmox/lxc-container/wireguard",
              },
            ],
          },
          { text: "Notes", link: "/proxmox/notes" },
        ],
      },
      {
        text: "Docker",
        collapsed: false,
        items: [
          { text: "Install Docker", link: "/docker/docker.md" },
          {
            text: "Docker Container",
            collapsed: true,
            items: [
              {
                text: "Authelia",
                link: "/docker/docker-container/authelia",
              },
              {
                text: "Authentik",
                link: "/docker/docker-container/authentik",
              },
              { text: "Deluge", link: "/docker/docker-container/deluge" },
              {
                text: "Fail2Ban",
                link: "/docker/docker-container/fail2ban",
              },
              {
                text: "FireflyIII",
                link: "/docker/docker-container/fireflyiii",
              },
              { text: "Gluetun", link: "/docker/docker-container/gluetun" },
              {
                text: "Homepage",
                link: "/docker/docker-container/homepage",
              },
              { text: "Netdata", link: "/docker/docker-container/netdata" },
              {
                text: "Nextcloud",
                link: "/docker/docker-container/nextcloud",
              },
              {
                text: "Nginx Proxy Manager",
                link: "/docker/docker-container/nginx-proxy-manager",
              },
              {
                text: "phpMyAdmin",
                link: "/docker/docker-container/phpmyadmin",
              },
              {
                text: "Plex Media Server",
                link: "/docker/docker-container/plex-media-server",
              },
              {
                text: "Prowlarr",
                link: "/docker/docker-container/prowlarr",
              },
              {
                text: "qBittorrent",
                link: "/docker/docker-container/qbittorrent",
              },
              { text: "Radarr", link: "/docker/docker-container/radarr" },
              { text: "VS Code", link: "/docker/docker-container/vs-code" },
              {
                text: "Whats Up Docker",
                link: "/docker/docker-container/whats-up-docker",
              },
            ],
          },
          {
            text: "Extra Configuration",
            link: "/docker/extra-configuration.md",
          },
        ],
      },
      {
        text: "Wazuh",
        collapsed: false,
        items: [
          { text: "Install", link: "/wazuh/install" },
          { text: "Configuration", link: "/wazuh/configuration" },
          {
            text: "Agents",
            collapsed: true,
            items: [
              {
                text: "Linux Configuration",
                link: "/wazuh/agent/linux-configuration",
              },
              {
                text: "Docker Listener",
                link: "/wazuh/agent/docker-listener",
              },
            ],
          },
          { text: "Utils", link: "/wazuh/utils" },
        ],
      },
    ],
  },
});
