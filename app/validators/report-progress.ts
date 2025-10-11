import { z } from 'zod';
import { ReportStatus } from '~/prisma-enums';

const base = z.object({
  phase: z
    .string({ required_error: 'Fase progress wajib diisi' })
    .trim()
    .min(5, 'Fase progress minimal 5 karakter'),
  status: z.nativeEnum(ReportStatus, {
    required_error: 'Status progress wajib dipilih',
  }),
  description: z
    .string({ required_error: 'Deskripsi progress wajib diisi' })
    .trim()
    .min(10, 'Deskripsi minimal 10 karakter'),
});

const reportProgressClientSchema = base;

const reportProgressServerSchema = base.extend({
  progressPhotoUrl: z
    .string({ required_error: 'Foto progress wajib diunggah.' })
    .trim()
    .min(1, 'Foto progress wajib diunggah.')
    .url('URL foto progress tidak valid'),
});

export {
  reportProgressClientSchema,
  reportProgressServerSchema,
  base as reportProgressBaseSchema,
};
export type ReportProgressClientInput = z.input<
  typeof reportProgressClientSchema
>;
export type ReportProgressPayload = z.output<typeof reportProgressServerSchema>;
