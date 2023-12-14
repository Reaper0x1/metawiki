import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'en-US',
  title: 'Metawiki',
  description: 'Self hosted server wiki',



  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      {
        text: 'Info',
        link: '/info',
      },

      {
        text: 'Proxmox',
        items: [
          { text: 'Getting started', link: '/proxmox/getting-started' },
          { text: 'Installation', link: '/proxmox/installation' },
          { text: 'General config', link: '/proxmox/general-config' },
        ],
      },
      {
        text: 'LXC Container',
        items: [
          { text: 'AdGuard Home', link: '/lxc-container/adguardhome' },
          { text: 'Nginx Proxy Manager', link: '/lxc-container/nginx-proxy-manager' },
        ],
      },
      {
        text: 'Docker Container',
        items: [
          { text: 'Nginx Proxy Manager', link: '/docker-container/nginx-proxy-manager' },
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
            text: 'Info',
            link: '/info',
          },
          {
            text: 'Proxmox',
            collapsed: true,
            items: [
              { text: 'Getting started', link: '/proxmox/getting-started' },
              { text: 'Installation', link: '/proxmox/installation' },
              { text: 'General config', link: '/proxmox/general-config' },
            ],
          },
          {
            text: 'LXC Container',
            collapsed: true,
            items: [
              { text: 'AdGuard Home', link: '/lxc-container/adguardhome' },
              { text: 'Nginx Proxy Manager', link: '/lxc-container/nginx-proxy-manager' },
            ],
          },
          {
            text: 'Docker Container',
            collapsed: true,
            items: [
              { text: 'Nginx Proxy Manager', link: '/docker-container/nginx-proxy-manager' },
            ],
          },
          // ...
        ],
      },
    ],
  },
});
