import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import tabsPlugin from 'vuepress-plugin-tabs';


export default defineUserConfig({
  plugins: [
    tabsPlugin()
  ],
  base: '/developers-docs/',
  
  locales: {
    '/': {
      lang: '한국어',
      // title: 'Nu Eyne Developers Docs',
      description: 'Guides you a quick, easy, and optimal way.',
    },
    '/en/': {
      lang: 'ENGLISH',
      // title: 'Nu Eyne Developers Docs',
      description: 'Guides you a quick, easy, and optimal way.',
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.ico' }]
  ],

  theme: defaultTheme({
    locales:{
      '/': {
        selectLanguageName: '한국어',
        navbar: ['/'],
        sidebar: {
          '/api-guide/': [
            '', // 기본적으로 'README.md' 파일을 참조
            {
              text: 'Withnox & Addnox',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/api-guide/withnox-addnox/', // 'withnox-addnox/README.md' 파일 참조
                '/api-guide/withnox-addnox/user.md', // 'withnox-addnox/user.md' 파일 참조
              ],
            },
          ],
        },
      },
      '/en/': {
        selectLanguageName: 'ENGLISH',
        navbar: ['/en/'],
        sidebar: {
          '/en/api-guide/': [
            '', // 기본적으로 'README.md' 파일을 참조
            {
              text: 'Withnox & Addnox',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/en/api-guide/withnox-addnox/', // 'withnox-addnox/README.md' 파일 참조
                '/en/api-guide/withnox-addnox/user.md', // 'withnox-addnox/user.md' 파일 참조
              ],
            },
            // '/en/test', // 'test.md' 파일을 참조
          ],
        },
      },
    },

    logo: '/images/logo_black.png',
    logoDark: '/images/logo_white.png',
    
  }),
  bundler: viteBundler(),
  
})
