import { Turnstile } from '@marsidev/react-turnstile';
import { useEffect } from 'react';

type Props = {
  siteKey: string;
  onToken: (token: string | null) => void;
  className?: string;
};

function TurnstileWidget({ onToken, className, siteKey }: Props) {
  // optional: bersihin token saat unmount
  useEffect(() => () => onToken(null), [onToken]);

  return (
    <Turnstile
      className={className}
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onToken(null)}
      onError={() => onToken(null)}
      options={{ theme: 'light', size: 'normal', language: 'auto' }}
    />
  );
}

export default TurnstileWidget;
