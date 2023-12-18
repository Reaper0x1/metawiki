import { defineConfig } from "vitepress";

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: "en-US",
  title: "Metawiki",
  description: "Self hosted server wiki",

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
          { text: "Installation", link: "/proxmox/installation" },
          { text: "General configuration", link: "/proxmox/general-config" },
          {
            text: "External drive configuration",
            link: "/proxmox/external-drive-configuration",
          },
          {
            text: "LXC Container",
            items: [
              { text: "AdGuard Home", link: "/lxc-container/adguardhome" },
              {
                text: "Nginx Proxy Manager",
                link: "/lxc-container/nginx-proxy-manager",
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
              { text: "Authentik", link: "/docker/docker-container/authentik" },
              { text: "Deluge", link: "/docker/docker-container/deluge" },
              { text: "Fail2Ban", link: "/docker/docker-container/fail2ban" },
              { text: "Netdata", link: "/docker/docker-container/netdata" },
              {
                text: "Nginx Proxy Manager",
                link: "/docker/docker-container/nginx-proxy-manager",
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
            ],
          },
        ],
      },

      // {
      //   text: 'Dropdown Menu',
      //   items: [
      //     { text: 'Item A', link: '/item-1' },
      //     { text: 'Item B', link: '/item-2' },
      //     { text: 'Item C', link: '/item-3' },
      //   ],
      // },

      // ...
    ],

    sidebar: [
      {
        // text: 'Guide',
        items: [
          {
            text: "Info",
            link: "/info",
          },
          {
            text: "Proxmox",
            collapsed: true,
            items: [
              { text: "Get started", link: "/proxmox/get-started" },
              { text: "Installation", link: "/proxmox/installation" },
              {
                text: "General configuration",
                link: "/proxmox/general-config",
              },
              {
                text: "External drive configuration",
                link: "/proxmox/external-drive-configuration",
              },
              {
                text: "LXC Container",
                collapsed: true,
                items: [
                  { text: "AdGuard Home", link: "/lxc-container/adguardhome" },
                  {
                    text: "Nginx Proxy Manager",
                    link: "/lxc-container/nginx-proxy-manager",
                  },
                ],
              },
              { text: "Notes", link: "/proxmox/notes" },
            ],
          },
          {
            text: "Docker",
            collapsed: true,
            items: [
              { text: "Install Docker", link: "/docker/docker.md" },
              {
                text: "Docker Container",
                collapsed: true,
                items: [
                  {
                    text: "Authentik",
                    link: "/docker/docker-container/authentik",
                  },
                  { text: "Deluge", link: "/docker/docker-container/deluge" },
                  {
                    text: "Fail2Ban",
                    link: "/docker/docker-container/fail2ban",
                  },
                  { text: "Netdata", link: "/docker/docker-container/netdata" },
                  {
                    text: "Nginx Proxy Manager",
                    link: "/docker/docker-container/nginx-proxy-manager",
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
                ],
              },
            ],
          },
          // ...
        ],
      },
    ],
  },
});
