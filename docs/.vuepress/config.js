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
      lang: 'ko-KR',
      // title: 'Nu Eyne Developers Docs',
      description: 'Guides you a quick, easy, and optimal way.',
    },
    '/en/': {
      lang: 'en-US',
      // title: 'Nu Eyne Developers Docs',
      description: 'Guides you a quick, easy, and optimal way.',
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/developers-docs/images/favicon.ico' }]
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
                '/api-guide/withnox-addnox/auth.md', // 'withnox-addnox/auth.md' 파일 참조
                '/api-guide/withnox-addnox/user.md', // 'withnox-addnox/user.md' 파일 참조
                '/api-guide/withnox-addnox/device.md', // 'withnox-addnox/device.md' 파일 참조
                '/api-guide/withnox-addnox/basestation.md', // 'withnox-addnox/basestation.md' 파일 참조
                '/api-guide/withnox-addnox/event.md', // 'withnox-addnox/event.md' 파일 참조
                '/api-guide/withnox-addnox/survey.md', // 'withnox-addnox/survey.md' 파일 참조
                '/api-guide/withnox-addnox/ota.md', // 'withnox-addnox/ota.md' 파일 참조
              ],
            },
            {
              text: 'Elexir 2.0',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/api-guide/elexir-2.0/', // 'elexir-2.0/README.md' 파일 참조
                // '/api-guide/elexir-2.0/auth.md', 
                // '/api-guide/elexir-2.0/user.md', 
                // '/api-guide/elexir-2.0/device.md', 
              ],
            },
            {
              text: 'Elexir Legacy',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/api-guide/elexir-legacy/', // 'withnox-addnox/README.md' 파일 참조
                '/api-guide/elexir-legacy/auth.md', 
                '/api-guide/elexir-legacy/user.md', 
                '/api-guide/elexir-legacy/device.md', 
              ],
            },
            {
              text: 'LUX',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/api-guide/lux/', // 'lux/README.md' 파일 참조
                '/api-guide/lux/auth.md', // 'lux/auth.md' 파일 참조
              ],
            },
            {
              text: 'ADT Device',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/api-guide/adt/', // 'adt/README.md' 파일 참조
                '/api-guide/adt/device.md', // 'adt/device.md' 파일 참조
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
                '/en/api-guide/withnox-addnox/auth.md', // 'withnox-addnox/auth.md' 파일 참조
                '/en/api-guide/withnox-addnox/user.md', // 'withnox-addnox/user.md' 파일 참조
                '/en/api-guide/withnox-addnox/event.md', // 'withnox-addnox/user.md' 파일 참조
              ],
            },
                        {
              text: 'LUX',
              collapsible: true, // 접을 수 있는 옵션 (선택 사항)
              children: [
                '/en/api-guide/lux/', // 'lux/README.md' 파일 참조
                '/en/api-guide/lux/auth.md', // 'lux/auth.md' 파일 참조
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
