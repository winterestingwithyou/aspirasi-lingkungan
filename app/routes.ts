import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('routes/app.tsx', [
    index('routes/index.tsx'),
    route('laporkan', 'routes/laporkan.tsx'),
    route('daftar-masalah', 'routes/daftar-masalah.tsx'),
    route('tentang-kami', 'routes/tentang.tsx'),
    route('kontak', 'routes/kontak.tsx'),
  ]),
  layout('routes/gov.tsx', [
    ...prefix('gov', [
      index('routes/gov-dashboard.tsx'),
      route('laporan', 'routes/gov-laporan.tsx'),
      route('laporan/:id', 'routes/gov-detail-laporan.tsx'),
      route('laporan/:id/edit', 'routes/gov-edit-laporan.tsx'),
      route('profil', 'routes/gov-profil.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
