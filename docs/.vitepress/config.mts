import 'dotenv/config'
import { defineConfig } from 'vitepress'

const publicBase: string = (process.env.PUBLIC_BASE as string)
const base = publicBase ? `/${publicBase}/` : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blog",
  description: "My blog",
  base,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
