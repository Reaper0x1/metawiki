import { defineConfig } from "vitepress";

var dockerPath = "docker"

var proxmoxPath = "proxmox"

var securityPath = "security"
var securityServPath = `${securityPath}/services`
var wazuhPath = `${securityServPath}/wazuh`
var wazuhListenerPath = `${wazuhPath}/docker-listener`

var autoPath = "automation"
var mediaServPath = `${autoPath}/services`

var mediaPath = "media-docs-files"
var mediaServPath = `${mediaPath}/services`

var personalPath = "personal"
var personalServPath = `${personalPath}/services`

var monitoringPath = "monitoring"
var monitoringServPath = `${monitoringPath}/services`

var devPath = "development"
var devServPath = `${devPath}/services`

var dashPath = "dashboard"
var dashServPath = `${dashPath}/services`

var gamingPath = "gaming"
var gamingServPath = `${gamingPath}/services`

var otherPath = "other"
var otherServPath = `${otherPath}/services`


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
        text: "⚡ Proxmox",
        items: [
          {
            text: "LXC Configuration",
            link: `/${proxmoxPath}/lxc-configuration`,
          },
          {
            text: "External Drive",
            link: `/${proxmoxPath}/external-drive`,
          },
          {
            text: "Notes",
            link: `/${proxmoxPath}/notes`,
          },
        ]
      },
      {
        text: "🐋 Docker",
        items: [
          { text: "Install Docker", link: `/${dockerPath}/install` },
          {
            text: "Extra Configuration",
            link: `/${dockerPath}/extra-configuration`,
          },
        ],
      },
      {
        text: "🏷️ Categories",
        items: [
          {
            text: "🤖 Automation",
            link: `/${autoPath}/info`,
          },
          {
            text: "🛡️ Security",
            link: `/${securityPath}/info`,
          },
          {
            text: "🎥 Media - Docs - Files",
            link: `/${mediaPath}/info`,
          },
          {
            text: "👨‍💻 Personal",
            link: `/${personalPath}/info`,
          },
          {
            text: "📊 Monitoring",
            link: `/${monitoringPath}/info`,
          },
          {
            text: "🚀 Development",
            link: `/${devPath}/info`,
          },
          {
            text: "🔎 Dashboard",
            link: `/${dashPath}/info`,
          },
          {
            text: "🎮 Gaming",
            link: `/${gamingPath}/info`,
          },
          {
            text: "🗂️ Other",
            link: `/${otherPath}/info`,
          },
        ],
      },
    ],

    sidebar: [
      {
        text: "Info",
        link: "/info",
      },
      {
        text: "⚡ Proxmox",
        collapsed: true,
        items: [
          {
            text: "LXC Configuration",
            link: `/${proxmoxPath}/lxc-configuration`,
          },
          {
            text: "External Drive",
            link: `/${proxmoxPath}/external-drive`,
          },
          {
            text: "Notes",
            link: `/${proxmoxPath}/notes`,
          },
        ]
      },
      {
        text: "🐋 Docker",
        collapsed: true,
        items: [
          { text: "Install Docker", link: `/${dockerPath}/install` },
          {
            text: "Extra Configuration",
            link: `/${dockerPath}/extra-configuration`,
          },
        ],
      },
      {
        text: "🤖 Automation",
        collapsed: true,
        items: []
      },
      {
        text: "🛡️ Security",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${securityPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "AdGuard Home",
                link: `/${securityServPath}/adguardhome`,
              },
              {
                text: "Authelia",
                link: `/${securityServPath}/authelia`,
              },
              {
                text: "Authentik",
                link: `/${securityServPath}/authentik`,
              },
              {
                text: "Fail2ban",
                link: `/${securityServPath}/fail2ban`,
              },
              {
                text: "Gluetun",
                link: `/${securityServPath}/gluetun`,
              },
              {
                text: "Nginx Proxy Manager",
                link: `/${securityServPath}/nginx-proxy-manager`,
              },
              {
                text: "Wazuh",
                collapsed: true,
                items: [
                  {
                    text: "Install",
                    link: `/${wazuhPath}/install`,
                  },
                  {
                    text: "Docker Listener",
                    collapsed: true,
                    items: [
                      {
                        text: "Info",
                        link: `/${wazuhListenerPath}/info`,
                      },
                      {
                        text: "Simple Configuration",
                        link: `/${wazuhListenerPath}/simple`,
                      },
                      {
                        text: "Advanced Configuration",
                        link: `/${wazuhListenerPath}/advanced`,
                      },
                    ]
                  },
                  {
                    text: "Utils",
                    link: `/${wazuhPath}/utils`,
                  },
                ]
              },
              {
                text: "Wireguard",
                link: `/${securityServPath}/wireguard`,
              },
            ],
          },

        ]
      },
      {
        text: "🎥 Media - Docs - Files",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${mediaPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "Deluge",
                link: `/${mediaServPath}/deluge`,
              },
              {
                text: "Duplicacy",
                link: `/${mediaServPath}/duplicacy`,
              },
              {
                text: "Komga",
                link: `/${mediaServPath}/komga`,
              },
              {
                text: "Nextcloud",
                link: `/${mediaServPath}/nextcloud`,
              },
              {
                text: "Plex Media Server",
                link: `/${mediaServPath}/plex-media-server`,
              },
              {
                text: "Projectsend",
                link: `/${mediaServPath}/projectsend`,
              },
              {
                text: "Prowlarr",
                link: `/${mediaServPath}/prowlarr`,
              },
              {
                text: "qBittorrent",
                link: `/${mediaServPath}/qbittorrent`,
              },
              {
                text: "Radarr",
                link: `/${mediaServPath}/radarr`,
              },
            ],
          },

        ]
      },
      {
        text: "👨‍💻 Personal",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${personalPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "Firefly III",
                link: `/${personalServPath}/fireflyiii`,
              },
            ]
          }
        ]
      },
      {
        text: "📊 Monitoring",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${monitoringPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "Netdata",
                link: `/${monitoringServPath}/netdata`,
              },
              {
                text: "Whats Up Docker",
                link: `/${monitoringServPath}/whats-up-docker`,
              },
            ]
          }
        ]
      },
      {
        text: "🚀 Development",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${devPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "MariaDB",
                link: `/${devServPath}/mariadb`,
              },
              {
                text: "phpMyAdmin",
                link: `/${devServPath}/phpmyadmin`,
              },
              {
                text: "VS Code Server",
                link: `/${devServPath}/vs-code`,
              },
            ]
          }
        ]
      },
      {
        text: "🔎 Dashboard",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${dashPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "Homepage",
                link: `/${dashServPath}/homepage`,
              },
            ]
          }
        ]
      },
      {
        text: "🎮 Gaming",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${gamingPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "Terraria Server",
                link: `/${gamingServPath}/terraria-server`,
              },
            ]
          }
        ]
      },
      {
        text: "🗂️ Other",
        collapsed: true,
        items: [
          {
            text: "Info",
            link: `/${otherPath}/info`,
          },
          {
            text: "Services",
            collapsed: true,
            items: [
              {
                text: "mylar3",
                link: `/${otherServPath}/mylar3`,
              },
            ]
          }
        ]
      },
    ],
  },
});
