import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'The Node Forge',
  tagline:
    'A flexible, lightweight Node.js JWT library for generating, verifying, and managing JSON Web Tokens (JWTs). Supports access and refresh tokens with customizable secrets for authentication and role-based access control. Includes middleware for Express, Fastify, Koa, Hapi, NestJS, and Next.js to streamline authentication in modern web applications.',
  favicon: 'img/favicon.ico',

  url: 'https://the-node-forge.github.io',
  baseUrl: '/jwt-utils/',
  trailingSlash: false,

  organizationName: 'The-Node-Forge',
  projectName: 'jwt-utils', // Edit
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/The-Node-Forge/jwt-utils/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/The-Node-Forge/jwt-utils/tree/main/docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/theNodeForge.png', // Edit
    navbar: {
      title: 'jwt-utils', // Your Package Name
      logo: {
        alt: 'The Node Forge Logo', // edit
        src: 'img/theNodeForge.png', // Your Logo
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },

        // {
        //   type: 'docSidebar',
        //   sidebarId: 'apiSidebar',
        //   position: 'left',
        //   label: 'API',
        // },
        // uncomment to enable blogs
        // { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/The-Node-Forge/jwt-utils',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'API',
              to: '/docs/intro/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/The-Node-Forge/jwt-utils',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Node Forge. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../src/index.ts'],
        tsconfig: '../tsconfig.json',
        out: 'docs/api',
        includeVersion: true,
        hideGenerator: true,
        categorizeByGroup: true,
        excludePrivate: true,
        excludeProtected: true,
        excludeExternals: true,
        excludeNotDocumented: true, // Exclude code without JSDoc comments
        plugin: ['typedoc-plugin-markdown'],
      },
    ],
  ],
};

export default config;
