import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [{ type: 'autogenerated', dirName: '.' }],

  // apiSidebar: [
  //   {
  //     type: 'category',
  //     label: 'API Reference',
  //     collapsible: true,
  //     collapsed: false,
  //     items: ['api/index', { type: 'autogenerated', dirName: 'api' }],
  //   },
  // ],
};

export default sidebars;
