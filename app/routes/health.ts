import {json} from '@remix-run/node';

export function loader() {
  return json(
    {status: 'ok'},
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
