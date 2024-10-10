import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  lang: 'en-US',

  title: 'Nu Eyne Developers Docs',
  description: 'Guides you a quick, easy, and optimal way.',

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',

    navbar: ['/', '/overview'],
    sidebar: {
      '/api-guide/':[
        '',
        'plugin'
      ],
    }
  }),

  bundler: viteBundler(),
})