import { z } from 'zod';

const createReportSchema = z
  .object({
    reporterName: z.string().min(3, 'Nama pelapor diperlukan'),
    reporterContact: z.string().min(10, 'Nomor WhatsApp tidak valid'),
    problemTypeId: z.coerce
      .number()
      .int()
      .positive('Jenis masalah tidak valid'),
    description: z.string().min(10, 'Deskripsi terlalu pendek'),
    photoUrl: z.string().url('URL foto tidak valid'),
    location: z.string(),
    latitude: z.coerce
      .number()
      .refine(
        (v) => v >= -90 && v <= 90,
        'Latitude harus di antara -90 dan 90',
      ),
    longitude: z.coerce
      .number()
      .refine(
        (v) => v >= -180 && v <= 180,
        'Longitude harus di antara -180 dan 180',
      ),
  })
  .strict();

export { createReportSchema };
