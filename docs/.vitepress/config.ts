import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { withPwa } from '@vite-pwa/vitepress'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { version } from '../../package.json'
import { teamMembers } from './contributors'
import {
  bluesky,
  contributing,
  discord,
  font,
  github,
  mastodon,
  ogImage,
  ogUrl,
  releases,
  vitestDescription,
  vitestName,
} from './meta'
import { pwa } from './scripts/pwa'
import { transformHead } from './scripts/transformHead'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

export default ({ mode }: { mode: string }) => {
  return withPwa(defineConfig({
    lang: 'en-US',
    title: vitestName,
    description: vitestDescription,
    locales: {
      root: {
        label: 'English',
        lang: 'en-US',
      },
      zh: {
        label: '简体中文',
        lang: 'zh',
        link: 'https://cn.vitest.dev/',
      },
    },
    head: [
      ['meta', { name: 'theme-color', content: '#729b1a' }],
      ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
      ['link', { rel: 'icon', href: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }],
      ['meta', { name: 'author', content: `${teamMembers.map(c => c.name).join(', ')} and ${vitestName} contributors` }],
      ['meta', { name: 'keywords', content: 'vitest, vite, test, coverage, snapshot, react, vue, preact, svelte, solid, lit, marko, ruby, cypress, puppeteer, jsdom, happy-dom, test-runner, jest, typescript, esm, tinypool, tinyspy, node' }],
      ['meta', { property: 'og:title', content: vitestName }],
      ['meta', { property: 'og:description', content: vitestDescription }],
      ['meta', { property: 'og:url', content: ogUrl }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { name: 'twitter:title', content: vitestName }],
      ['meta', { name: 'twitter:description', content: vitestDescription }],
      ['meta', { name: 'twitter:image', content: ogImage }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: font }],
      ['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${font}" />`],
      ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
      ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    ],
    lastUpdated: true,
    vite: {
      plugins: [
        groupIconVitePlugin({
          customIcon: {
            'CLI': 'vscode-icons:file-type-shell',
            'vitest.workspace': 'vscode-icons:file-type-vitest',
            'vitest.config': 'vscode-icons:file-type-vitest',
            '.spec.ts': 'vscode-icons:file-type-testts',
            '.test.ts': 'vscode-icons:file-type-testts',
            '.spec.js': 'vscode-icons:file-type-testjs',
            '.test.js': 'vscode-icons:file-type-testjs',
            'marko': 'vscode-icons:file-type-marko',
          },
        }),
      ],
    },
    markdown: {
      config(md) {
        md.use(tabsMarkdownPlugin)
        md.use(groupIconMdPlugin)
      },
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      codeTransformers: mode === 'development'
        ? []
        : [
            transformerTwoslash({
              processHoverInfo: (info) => {
                if (info.includes(process.cwd())) {
                  return info.replace(new RegExp(process.cwd(), 'g'), '')
                }
                return info
              },
            }),
          ],
    },
    themeConfig: {
      logo: '/logo.svg',

      editLink: {
        pattern: 'https://github.com/vitest-dev/vitest/edit/main/docs/:path',
        text: 'Suggest changes to this page',
      },

      search: {
        provider: 'local',
      /* provider: 'algolia',
      options: {
        appId: 'ZTF29HGJ69',
        apiKey: '9c3ced6fed60d2670bb36ab7e8bed8bc',
        indexName: 'vitest',
        // searchParameters: {
        //   facetFilters: ['tags:en'],
        // },
      }, */
      },

      carbonAds: {
        code: 'CW7DVKJE',
        placement: 'vitestdev',
      },

      socialLinks: [
        { icon: 'bluesky', link: bluesky },
        { icon: 'mastodon', link: mastodon },
        { icon: 'discord', link: discord },
        { icon: 'github', link: github },
      ],

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2021-PRESENT Anthony Fu, Matías Capeletto and Vitest contributors',
      },

      nav: [
        { text: 'Guide & API', link: '/guide/', activeMatch: '^/(guide|api)/(?!browser)' },
        { text: 'Config', link: '/config/', activeMatch: '^/config/' },
        { text: 'Browser Mode', link: '/guide/browser', activeMatch: '^/guide/browser/' },
        {
          text: 'Resources',
          items: [
            {
              text: 'Advanced',
              link: '/advanced/api',
              activeMatch: '^/advanced/',
            },
            {
              text: 'Team',
              link: '/team',
            },
          ],
        },
        {
          text: `v${version}`,
          items: [
            {
              items: [
                {
                  text: `v${version}`,
                  link: `https://github.com/vitest-dev/vitest/releases/tag/v${version}`,
                },
                {
                  text: 'Releases Notes',
                  link: releases,
                },
                {
                  text: 'Contributing',
                  link: contributing,
                },
              ],
            },
            {
              items: [
                {
                  text: 'unreleased',
                  link: 'https://main.vitest.dev/',
                },
                {
                  text: 'v0.x',
                  link: 'https://v0.vitest.dev/',
                },
                {
                  text: 'v1.x',
                  link: 'https://v1.vitest.dev/',
                },
              ],
            },
          ],
        },
      ],

      sidebar: {
        '/guide/browser': [
          {
            text: 'Introduction',
            collapsed: false,
            items: [
              {
                text: 'Why Browser Mode',
                link: '/guide/browser/why',
                docFooterText: 'Why Browser Mode | Browser Mode',
              },
              {
                text: 'Getting Started',
                link: '/guide/browser/',
                docFooterText: 'Getting Started | Browser Mode',
              },
            ],
          },
          {
            text: 'API',
            collapsed: false,
            items: [
              {
                text: 'Context API',
                link: '/guide/browser/context',
                docFooterText: 'Context API | Browser Mode',
              },
              {
                text: 'Interactivity API',
                link: '/guide/browser/interactivity-api',
                docFooterText: 'Interactivity API | Browser Mode',
              },
              {
                text: 'Locators',
                link: '/guide/browser/locators',
                docFooterText: 'Locators | Browser Mode',
              },
              {
                text: 'Assertion API',
                link: '/guide/browser/assertion-api',
                docFooterText: 'Assertion API | Browser Mode',
              },
              {
                text: 'Commands API',
                link: '/guide/browser/commands',
                docFooterText: 'Commands | Browser Mode',
              },
            ],
          },
          footer(),
        ],
        '/advanced': [
          {
            text: 'API',
            collapsed: false,
            items: [
              {
                text: 'Vitest Node API',
                link: '/advanced/api',
              },
              {
                text: 'Runner API',
                link: '/advanced/runner',
              },
              {
                text: 'Task Metadata',
                link: '/advanced/metadata',
              },
            ],
          },
          {
            text: 'Guides',
            collapsed: false,
            items: [
              {
                text: 'Running Tests',
                link: '/advanced/guide/tests',
              },
              {
                text: 'Extending Reporters',
                link: '/advanced/reporters',
              },
              {
                text: 'Custom Pool',
                link: '/advanced/pool',
              },
            ],
          },
          footer(),
        ],
        '/team': [],
        '/': [
          {
            text: 'Introduction',
            collapsed: false,
            items: introduction(),
          },
          {
            text: 'API',
            collapsed: false,
            items: api(),
          },
          {
            text: 'Guides',
            collapsed: false,
            items: guide(),
          },
          {
            items: [
              {
                text: 'Browser Mode',
                link: '/guide/browser',
              },
              {
                text: 'Advanced API',
                link: '/advanced/api',
              },
            ],
          },
        ],
      },
    },
    pwa,
    transformHead,
  }))
}

function footer(): DefaultTheme.SidebarItem {
  return {
    items: [
      {
        text: 'Config Reference',
        link: '/config/',
      },
      {
        text: 'Test API Reference',
        link: '/api/',
      },
    ],
  }
}

function introduction(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Why Vitest',
      link: '/guide/why',
    },
    {
      text: 'Getting Started',
      link: '/guide/',
    },
    {
      text: 'Features',
      link: '/guide/features',
    },
    {
      text: 'Config Reference',
      link: '/config/',
    },
  ]
}

function guide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Workspace',
      link: '/guide/workspace',
    },
    {
      text: 'CLI',
      link: '/guide/cli',
    },
    {
      text: 'Test Filtering',
      link: '/guide/filtering',
    },
    {
      text: 'Reporters',
      link: '/guide/reporters',
    },
    {
      text: 'Coverage',
      link: '/guide/coverage',
    },
    {
      text: 'Snapshot',
      link: '/guide/snapshot',
    },
    {
      text: 'Mocking',
      link: '/guide/mocking',
    },
    {
      text: 'Testing Types',
      link: '/guide/testing-types',
    },
    {
      text: 'Vitest UI',
      link: '/guide/ui',
    },
    {
      text: 'In-Source Testing',
      link: '/guide/in-source',
    },
    {
      text: 'Test Context',
      link: '/guide/test-context',
    },
    {
      text: 'Environment',
      link: '/guide/environment',
    },
    {
      text: 'Extending Matchers',
      link: '/guide/extending-matchers',
    },
    {
      text: 'IDE Integration',
      link: '/guide/ide',
    },
    {
      text: 'Debugging',
      link: '/guide/debugging',
    },
    {
      text: 'Comparisons',
      link: '/guide/comparisons',
    },
    {
      text: 'Migration Guide',
      link: '/guide/migration',
    },
    {
      text: 'Common Errors',
      link: '/guide/common-errors',
    },
    {
      text: 'Profiling Test Performance',
      link: '/guide/profiling-test-performance',
    },
    {
      text: 'Improving Performance',
      link: '/guide/improving-performance',
    },
  ]
}

function api(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Test API Reference',
      link: '/api/',
    },
    {
      text: 'Mock Functions',
      link: '/api/mock',
    },
    {
      text: 'Vi Utility',
      link: '/api/vi',
    },
    {
      text: 'Expect',
      link: '/api/expect',
    },
    {
      text: 'ExpectTypeOf',
      link: '/api/expect-typeof',
    },
    {
      text: 'Assert',
      link: '/api/assert',
    },
    {
      text: 'AssertType',
      link: '/api/assert-type',
    },
  ]
}
