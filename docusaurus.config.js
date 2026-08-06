// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'అనుష్ఠానం',
  tagline: 'Daily Hindu Anushtanam · stotras & suktas in Telugu with transliteration',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://anushthanam.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served.
  // For a user/org GitHub Pages site (repo name == org name), baseUrl is '/'.
  baseUrl: '/',

  organizationName: 'Anushthanam',
  projectName: 'Anushthanam.github.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'te',
    locales: ['te'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
          'always',
        ],
        swCustom: require.resolve('./src/sw.js'),
        pwaHead: [
          {tagName: 'link', rel: 'icon', href: '/img/logo.svg'},
          {tagName: 'link', rel: 'manifest', href: '/manifest.json'},
          {tagName: 'meta', name: 'theme-color', content: '#b8860b'},
          {tagName: 'meta', name: 'apple-mobile-web-app-capable', content: 'yes'},
          {tagName: 'meta', name: 'apple-mobile-web-app-status-bar-style', content: '#000'},
          {tagName: 'link', rel: 'apple-touch-icon', href: '/img/logo.svg'},
          {tagName: 'link', rel: 'mask-icon', href: '/img/logo.svg', color: '#b8860b'},
          {tagName: 'meta', name: 'msapplication-TileImage', content: '/img/logo.svg'},
          {tagName: 'meta', name: 'msapplication-TileColor', content: '#000000'},
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'అనుష్ఠానం',
        logo: {
          alt: 'Anushtanam',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'గ్రంథాలయం · Library',
          },
        ],
      },
      footer: undefined,
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
