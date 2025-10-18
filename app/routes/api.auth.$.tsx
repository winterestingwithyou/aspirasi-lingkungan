import { makeAuth } from '~/lib/auth';
import type { Route } from './+types/api.auth.$';

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = await makeAuth(context.cloudflare.env);
  return auth.handler(request);
}

export async function action({ request, context }: Route.ActionArgs) {
  const auth = await makeAuth(context.cloudflare.env);
  return auth.handler(request);
}
