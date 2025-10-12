type EmailAddress = {
  email: string;
  name?: string;
};

export enum EmailContentType {
  TEXT = 'text/plain',
  HTML = 'text/html',
}

type EmailContent = {
  type: EmailContentType;
  value: string;
};

export type EmailPayload = {
  personalizations: Array<{
    to: EmailAddress[];
  }>;
  from: EmailAddress;
  reply_to?: EmailAddress;
  subject: string;
  content: EmailContent[];
  headers?: Record<string, string>;
};

export type GmailCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  senderEmail: string;
};

export type GmailSendResult =
  | { success: true }
  | { success: false; error: string };

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_SEND_URL =
  'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

async function fetchAccessToken(
  credentials: GmailCredentials,
): Promise<GmailSendResult & { token?: string }> {
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      success: false,
      error: `Gagal mendapatkan token Gmail: ${text || response.statusText}`,
    };
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    return {
      success: false,
      error: 'Respons token Gmail tidak mengandung access_token',
    };
  }

  return { success: true, token: data.access_token };
}

function encodeMimeMessage(payload: EmailPayload): string {
  const to = payload.personalizations
    .flatMap((item) => item.to)
    .map((addr) => (addr.name ? `${addr.name} <${addr.email}>` : addr.email))
    .join(', ');

  const fromHeader = payload.from.name
    ? `${payload.from.name} <${payload.from.email}>`
    : payload.from.email;

  const replyTo = payload.reply_to
    ? payload.reply_to.name
      ? `${payload.reply_to.name} <${payload.reply_to.email}>`
      : payload.reply_to.email
    : null;

  const textPart =
    payload.content.find((item) => item.type === 'text/plain')?.value ?? '';
  const htmlPart =
    payload.content.find((item) => item.type === 'text/html')?.value ?? '';

  const boundary = `=_Part_${Math.random().toString(36).slice(2)}`;
  const lines: string[] = [
    `From: ${fromHeader}`,
    `To: ${to}`,
    `Subject: ${payload.subject}`,
    'MIME-Version: 1.0',
  ];

  if (replyTo) {
    lines.push(`Reply-To: ${replyTo}`);
  }

  if (payload.headers) {
    for (const [key, value] of Object.entries(payload.headers)) {
      lines.push(`${key}: ${value}`);
    }
  }

  if (textPart && htmlPart) {
    lines.push(
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
    );
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push('Content-Transfer-Encoding: 7bit', '', textPart, '');
    lines.push(`--${boundary}`);
    lines.push('Content-Type: text/html; charset="UTF-8"');
    lines.push('Content-Transfer-Encoding: 7bit', '', htmlPart, '');
    lines.push(`--${boundary}--`, '');
  } else if (htmlPart) {
    lines.push('Content-Type: text/html; charset="UTF-8"');
    lines.push('Content-Transfer-Encoding: 7bit', '', htmlPart, '');
  } else {
    lines.push('Content-Type: text/plain; charset="UTF-8"');
    lines.push('Content-Transfer-Encoding: 7bit', '', textPart, '');
  }

  return lines.join('\r\n');
}

function encodeToBase64Url(value: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  let binary = '';

  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }

  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendWithGmail(
  payload: EmailPayload,
  credentials: GmailCredentials,
): Promise<GmailSendResult> {
  const accessTokenResult = await fetchAccessToken(credentials);
  if (!accessTokenResult.success) {
    return { success: false, error: accessTokenResult.error };
  }
  if (!accessTokenResult.token) {
    return { success: false, error: 'No access token received' };
  }

  const rawMessage = encodeMimeMessage(payload);
  const raw = encodeToBase64Url(rawMessage);

  const response = await fetch(GMAIL_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessTokenResult.token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      success: false,
      error: `Gmail API gagal: ${text || response.statusText}`,
    };
  }

  return { success: true };
}
