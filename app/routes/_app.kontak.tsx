import { escapeHtml, nl2br } from '~/helper/html';
import KontakPage from '~/pages/kontak-page';
import { sendWithGmail, type EmailPayload } from '~/server/lib/gmail';
import { verifyTurnstile } from '~/server/lib/tunstile';
import type { Route } from './+types/_app.kontak';

// eslint-disable-next-line no-empty-pattern
function meta({}: Route.MetaArgs) {
  return [
    { title: 'Kontak - Web Aspirasi Lingkungan' },
    {
      name: 'description',
      content: 'Hubungi kami untuk pertanyaan, kritik, atau saran.',
    },
  ];
}

const FEEDBACK_TYPES = new Set(['bugs', 'questions', 'comments']);

async function action({ request, context }: Route.ActionArgs) {
  const form = await request.formData();
  const token = form.get('cf-turnstile-response');

  if (typeof token !== 'string' || !token) {
    return Response.json(
      { success: false, error: 'Captcha tidak ditemukan' },
      { status: 400 },
    );
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? undefined;

  try {
    const captchaResult = await verifyTurnstile(
      context.cloudflare.env.TURNSTILE_SECRET_KEY,
      token,
      ip,
    );

    const { success, ['error-codes']: codes } = captchaResult;
    if (!success) {
      return Response.json(
        {
          success: false,
          error: 'Verifikasi captcha gagal',
          details: codes,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: 'Gagal menghubungi layanan captcha',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  const rawType = form.get('type');
  const message = form.get('feedback');
  const first = form.get('first');
  const last = form.get('last');
  const email = form.get('email');

  if (typeof rawType !== 'string' || !FEEDBACK_TYPES.has(rawType)) {
    return Response.json(
      { success: false, error: 'Jenis feedback tidak valid' },
      { status: 400 },
    );
  }

  if (typeof message !== 'string' || !message.trim()) {
    return Response.json(
      { success: false, error: 'Pesan tidak boleh kosong' },
      { status: 400 },
    );
  }

  if (typeof first !== 'string' || !first.trim()) {
    return Response.json(
      { success: false, error: 'Nama depan wajib diisi' },
      { status: 400 },
    );
  }

  if (typeof email !== 'string' || !email.trim()) {
    return Response.json(
      { success: false, error: 'Email wajib diisi' },
      { status: 400 },
    );
  }

  const {
    CONTACT_TO,
    SITE_NAME,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_SENDER_EMAIL,
  } = context.cloudflare.env;
  const missingEnv = [
    'CONTACT_TO',
    'SITE_NAME',
    'GMAIL_CLIENT_ID',
    'GMAIL_CLIENT_SECRET',
    'GMAIL_REFRESH_TOKEN',
    'GMAIL_SENDER_EMAIL',
  ].filter((key) => {
    const value =
      context.cloudflare.env[key as keyof typeof context.cloudflare.env];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missingEnv.length > 0) {
    return Response.json(
      {
        success: false,
        error: `Konfigurasi email belum lengkap (${missingEnv.join(', ')}).`,
      },
      { status: 500 },
    );
  }

  const siteName = SITE_NAME.trim();
  const destinationEmail = CONTACT_TO.trim();
  const gmailSender = GMAIL_SENDER_EMAIL.trim();

  const fullName = [first.trim(), typeof last === 'string' ? last.trim() : '']
    .filter(Boolean)
    .join(' ');
  const normalizedEmail = email.trim();
  const cleanedMessage = message.trim();
  const subject = `[Contact Form][${rawType.toUpperCase()}] ${
    fullName || normalizedEmail
  }`;

  const txt = [
    `Jenis: ${rawType}`,
    `Nama : ${fullName}`,
    `Email: ${normalizedEmail}`,
    ``,
    `Pesan:`,
    cleanedMessage,
    ``,
    `Email ini dikirim otomatis dari ${siteName}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif">
      <h2>Pesan baru dari Form Kontak</h2>
      <p><b>Jenis:</b> ${escapeHtml(rawType)}</p>
      <p><b>Nama:</b> ${escapeHtml(fullName)}</p>
      <p><b>Email:</b> ${escapeHtml(normalizedEmail)}</p>
      <p><b>Pesan:</b><br/>${nl2br(escapeHtml(cleanedMessage))}</p>
      <hr/>
      <small>Dikirim otomatis dari ${escapeHtml(siteName)}.</small>
    </div>
  `.trim();

  const payload: EmailPayload = {
    personalizations: [
      {
        to: [{ email: destinationEmail }],
      },
    ],
    from: {
      email: gmailSender,
      name: siteName,
    },
    reply_to: {
      email: normalizedEmail,
      name: fullName || normalizedEmail,
    },
    subject,
    content: [
      { type: 'text/plain', value: txt },
      { type: 'text/html', value: html },
    ],
    headers: {
      'X-Source-IP': request.headers.get('CF-Connecting-IP') || '',
      'X-User-Agent': request.headers.get('User-Agent') || '',
    },
  };

  try {
    const sendMessage = await sendWithGmail(payload, {
      clientId: GMAIL_CLIENT_ID.trim(),
      clientSecret: GMAIL_CLIENT_SECRET.trim(),
      refreshToken: GMAIL_REFRESH_TOKEN.trim(),
      senderEmail: gmailSender,
    });

    if (!sendMessage.success) {
      console.error('Gmail send error:', sendMessage.error);
      return Response.json(
        {
          success: false,
          error: 'Gagal mengirim pesan, silakan coba lagi nanti.',
          details: sendMessage.error,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Gmail request failed:', error);
    return Response.json(
      {
        success: false,
        error: 'Terjadi kesalahan saat mengirim pesan.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  return Response.json({ success: true });
}

async function loader({ context }: Route.LoaderArgs) {
  const siteKey = context.cloudflare.env.TURNSTILE_SITE_KEY;
  return { siteKey };
}

function Tentang() {
  return <KontakPage />;
}

export { meta, action, loader, Tentang as default };
