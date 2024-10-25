export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
  // adding one more key for role based visibility of modules
  roles?: string[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'erp',
    title: 'ERP',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'User',
        title: 'User Management',
        type: 'item',
        url: '/users',
        icon: 'bi bi-person-plus',
        roles: ['1000']
      },
      
    ],
    roles: ['1000', '3000', '6000', '7000']
  },
  {
    id: 'inventory',
    title: 'Inventory',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'purchaseVoucher',
        title: 'Purchase Voucher',
        type: 'item',
        url: '/purchase-voucher',
        icon: 'bi bi-bag',
        roles: ['1000', '3000', '6000', '7000']
      },
      {
        id: 'Inventory',
        title: 'Inventory Management',
        type: 'item',
        url: '/inventory',
        icon: 'bi bi-diagram-3',
        roles: ['1000', '3000', '6000', '7000']
      }
    ]
  },
  {
    id: 'traffic',
    title: 'Traffic',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'voucher',
        title: 'Voucher Management',
        type: 'item',
        url: '/voucher',
        icon: 'bi bi-journals',
        roles: ['1000', '3000', '6000', '7000', '8000']
      }
    ],
    roles: ['1000', '3000', '6000', '7000', '8000']
  },
  {
    id: 'sales',
    title: 'Sales',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'saleProduct',
        title: ' Sale Management',
        type: 'item',
        url: '/sale' ,
        icon:'bi bi-shop',
        roles: ['1000', '2000']
      },
    ],
    roles: ['1000','2000']
  },
  {
    id: 'operations',
    title: 'Operations',
    type: 'group',
    icon: 'icon-group',
    children:[
      {
        id: 'custom',
        title: 'Custom Order',
        type: 'item',
        url: '/custom-order' ,
        icon:'bi bi-card-checklist',
        roles: ['1000', '3000', '6000', '7000']
      },
      {
        id: 'pendingSale',
        title: 'Pending Payment',
        type: 'item',
        url: 'pending-payment' ,
        icon:'bi bi-currency-rupee',
        roles: ['1000', '3000', '6000', '7000']
      },
      {
        id: 'linkSale',
        title: 'Link Sale',
        type: 'item',
        url: 'link-sale' ,
        icon:'bi bi-link',
        roles: ['1000', '3000', '6000', '7000']
      },
      {
        id: 'deliveryShipment',
        title: 'Delivery & Shipment',
        type: 'item',
        url: 'delivery-shipment' ,
        icon:'bi bi-truck',
        roles: ['1000', '3000', '6000', '7000']
      },
    ],
    roles: ['1000','3000', '6000','7000']
  },
  {
    id: 'analysis',
    title: 'Analysis',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sale-analysis',
        title: 'Analysis',
        type: 'item',
        url: '/analysis',
        icon: 'bi bi-graph-up-arrow',
        roles: ['1000']
      }
    ],
    roles: ['1000']
  },


  // {
  //   id: 'sales',
  //   title: 'Sales',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'saleProduct',
  //       title: 'Sale Product',
  //       type: 'item',
  //       url: '/sales/sale-list' ,
  //       icon:'feather icon-github'
  //     }
  //   ]
  // },
//   {
//     id: 'navigation',
//     title: 'Navigation',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'dashboard',
//         title: 'Dashboard',
//         type: 'item',
//         url: '/analytics',
//         icon: 'feather icon-home'
//       }
//     ]
//   },
//   {
//     id: 'ui-component',
//     title: 'Ui Component',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'basic',
//         title: 'Component',
//         type: 'collapse',
//         icon: 'feather icon-box',
//         children: [
//           {
//             id: 'button',
//             title: 'Button',
//             type: 'item',
//             url: '/component/button'
//           },
//           {
//             id: 'badges',
//             title: 'Badges',
//             type: 'item',
//             url: '/component/badges'
//           },
//           {
//             id: 'breadcrumb-pagination',
//             title: 'Breadcrumb & Pagination',
//             type: 'item',
//             url: '/component/breadcrumb-paging'
//           },
//           {
//             id: 'collapse',
//             title: 'Collapse',
//             type: 'item',
//             url: '/component/collapse'
//           },
//           {
//             id: 'tabs-pills',
//             title: 'Tabs & Pills',
//             type: 'item',
//             url: '/component/tabs-pills'
//           },
//           {
//             id: 'typography',
//             title: 'Typography',
//             type: 'item',
//             url: '/component/typography'
//           }
//         ]
//       }
//     ]
//   },
  // {
  //   id: 'Authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
      // {
      //   id: 'signup',
      //   title: 'Sign up',
      //   type: 'item',
      //   url: '/auth/signup',
      //   icon: 'feather icon-at-sign',
      //   target: false,
      //   breadcrumbs: false
      // },
    //   {
    //     id: 'signin',
    //     title: 'Sign in',
    //     type: 'item',
    //     url: '/auth/signin',
    //     icon: 'feather icon-log-in',
    //     target: false,
    //     breadcrumbs: false
    //   }
    // ],
    // roles: ['1000','2000', '3000', '4000', '5000', '6000', '7000']
  // },
//   {
//     id: 'chart',
//     title: 'Chart',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'apexchart',
//         title: 'ApexChart',
//         type: 'item',
//         url: '/chart',
//         classes: 'nav-item',
//         icon: 'feather icon-pie-chart'
//       }
//     ]
//   },
//   {
//     id: 'forms & tables',
//     title: 'Forms & Tables',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'forms',
//         title: 'Basic Elements',
//         type: 'item',
//         url: '/forms',
//         classes: 'nav-item',
//         icon: 'feather icon-file-text'
//       },
//       {
//         id: 'tables',
//         title: 'tables',
//         type: 'item',
//         url: '/tables',
//         classes: 'nav-item',
//         icon: 'feather icon-server'
//       }
//     ]
//   },
//   {
//     id: 'other',
//     title: 'Other',
//     type: 'group',
//     icon: 'icon-group',
//     children: [
//       {
//         id: 'sample-page',
//         title: 'Sample Page',
//         type: 'item',
//         url: '/sample-page',
//         classes: 'nav-item',
//         icon: 'feather icon-sidebar'
//       },
//       {
//         id: 'menu-level',
//         title: 'Menu Levels',
//         type: 'collapse',
//         icon: 'feather icon-menu',
//         children: [
//           {
//             id: 'menu-level-2.1',
//             title: 'Menu Level 2.1',
//             type: 'item',
//             url: 'javascript:',
//             external: true
//           },
//           {
//             id: 'menu-level-2.2',
//             title: 'Menu Level 2.2',
//             type: 'collapse',
//             children: [
//               {
//                 id: 'menu-level-2.2.1',
//                 title: 'Menu Level 2.2.1',
//                 type: 'item',
//                 url: 'javascript:',
//                 external: true
//               },
//               {
//                 id: 'menu-level-2.2.2',
//                 title: 'Menu Level 2.2.2',
//                 type: 'item',
//                 url: 'javascript:',
//                 external: true
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
];
