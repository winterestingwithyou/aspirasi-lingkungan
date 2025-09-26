import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('layouts/app-layout.tsx', [
    index('pages/landing-page.tsx'),
    route('laporkan', 'pages/report-page.tsx'),
    route('daftar-masalah', 'pages/daftar-masalah-page.tsx'),
  ]),
  layout('pages/gov/gov-layout.tsx', [
    ...prefix('gov', [
      index('pages/gov/gov-dashboard.tsx'),
      route('laporan', 'pages/gov/gov-laporan.tsx'),
      route('laporan/:id', 'pages/gov/gov-detail-laporan.tsx'),
      route('laporan/:id/edit', 'pages/gov/gov-edit-laporan.tsx'),
      route('profil', 'pages/gov/gov-profil.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
