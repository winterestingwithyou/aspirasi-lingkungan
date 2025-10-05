import { Turnstile } from '@marsidev/react-turnstile';
import { useEffect } from 'react';

type Props = {
  onToken: (token: string | null) => void;
  className?: string;
};

function TurnstileWidget({ onToken, className }: Props) {
  // optional: bersihin token saat unmount
  useEffect(() => () => onToken(null), [onToken]);

  return (
    <Turnstile
      className={className}
      siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
      onSuccess={onToken}
      onExpire={() => onToken(null)}
      onError={() => onToken(null)}
      options={{ theme: 'light', size: 'normal', language: 'auto' }}
    />
  );
}

export default TurnstileWidget;
