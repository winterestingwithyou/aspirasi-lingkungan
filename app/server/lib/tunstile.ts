import type { TurnstileVerifyResult } from '~/types';

export async function verifyTurnstile(
  secret: string,
  token: string,
  ip?: string,
) {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const resp = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body,
    },
  );
  const data = (await resp.json()) as TurnstileVerifyResult;
  return data;
}
