import 'dotenv/config'
import { defineConfig } from 'vitepress'

const publicBase: string = (process.env.PUBLIC_BASE as string)
const base = publicBase ? `/${publicBase}/` : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Jerome Mare",
  description: "Mon blog",
  base,
  ignoreDeadLinks: true,
  head: [
    [ 'link', { rel: 'icon', href: '/images/favicon.png' } ],
  ],

  locales: {
    root: {
      label: 'Français',
      lang: 'fr'
    },
    es: {
      label: 'Español',
      lang: 'es',
      link: '/es',
    },
    fr: {
      label: 'English',
      lang: 'en',
      link: '/en',
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Articles', link: '/articles' },
      { text: 'A propos de moi', link: '/bio' },
    ],

    sidebar: [
      {
        text: 'A propos de moi',
        items: [
          { text: 'Bio', link: '/bio' },
          { text: 'Resume', link: '/resume' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'linkedin', link: 'https://fr.linkedin.com/in/j%C3%A9r%C3%B4me-mare-844a87320/' },
      { icon: 'github', link: 'https://github.com/jeromemare' },
    ],

    search: {
      provider: 'local'
    },
  }
})
