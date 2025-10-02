import { z } from 'zod';

/** Util: ubah '' -> undefined */
const optionalize = z
  .string()
  .transform((v) => v.trim())
  .pipe(z.string())
  .transform((v) => (v === '' ? undefined : v));

/** WA Indonesia (longgar): 08xxxxxxxxxx atau +62xxxxxxxxxx, opsional */
const waRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export const createReportSchema = z.object({
  reporterName: z
    .string({ required_error: 'Nama pelapor diperlukan' })
    .trim()
    .min(1, 'Nama pelapor diperlukan'),

  reporterContact: optionalize
    .optional()
    .refine(
      (v) => !v || waRegex.test(v),
      'Nomor WhatsApp tidak valid (contoh: 08xxxxxxxxxx atau +628xxxxxxxx)',
    ),

  // dari <select> → string → angka
  problemTypeId: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === 'string' ? Number(v) : v))
    .refine((n) => Number.isInteger(n) && n > 0, 'Jenis masalah wajib dipilih'),

  description: z
    .string({ required_error: 'Deskripsi diperlukan' })
    .trim()
    .min(10, 'Deskripsi terlalu pendek (min. 10 karakter)'),

  // URL hasil upload ke Cloudinary; boleh null
  photoUrl: z.string().url().nullable().optional(),

  location: optionalize.optional(),

  // dari input text → number
  latitude: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === 'string' ? Number(v) : v))
    .refine((n) => Number.isFinite(n), 'Latitude harus berupa angka')
    .refine((n) => n >= -90 && n <= 90, 'Latitude harus di antara -90..90'),

  longitude: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === 'string' ? Number(v) : v))
    .refine((n) => Number.isFinite(n), 'Longitude harus berupa angka')
    .refine(
      (n) => n >= -180 && n <= 180,
      'Longitude harus di antara -180..180',
    ),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
