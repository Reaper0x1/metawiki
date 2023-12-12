import { defineConfig } from 'vitepress';

// refer https://vitepress.dev/reference/site-config for details
export default defineConfig({
  lang: 'en-US',
  title: 'Metawiki',
  description: 'Self hosted server wiki',

  themeConfig: {
    nav: [
      {
        text: 'Info',
        link: '/info',
      },

      {
        text: 'Proxmox',
        items: [
          { text: 'Getting Started', link: '/proxmox/getting-started' },
          { text: 'Installation', link: '/proxmox/installation' },
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
            collapsed: false,
            items: [
              { text: 'Getting Started', link: '/proxmox/getting-started' },
              { text: 'Installation', link: '/proxmox/installation' },
            ],
          },
          // ...
        ],
      },
    ],
  },
});
