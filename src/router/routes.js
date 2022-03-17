const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('pages/Home.vue'),
  },
  {
    path: '/:lang(de|en|fr)',
    redirect: {
      name: 'wizard',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'wizard',
        component: () => import('pages/Wizard.vue'),
      },
      {
        path: 'jobs',
        name: 'jobs',
        component: () => import('pages/jobs/Index.vue'),
      },
      {
        path: 'edit/job/:id',
        name: 'job',
        props: true,
        component: () => import('pages/Wizard.vue'),
      },
      {
        path: 'create/job',
        name: 'create-job',
        component: () => import('pages/Wizard.vue'),
      },
      {
        path: 'jobboard',
        name: 'jobboard',
        component: () => import('pages/jobboard/Index.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/Settings.vue'),
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('pages/Statistics.vue'),
      },
      {
        path: 'templates',
        name: 'templates',
        component: () => import('pages/Templates.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
