import { beforeAll } from 'vitest';

let baseURL;

beforeAll(async () => {
  baseURL = (await (await fetch(`${ process.env.SERVER_URL }/.well-known/webfinger?resource=acct:${ process.env.USER1 }@${ (new URL(process.env.SERVER_URL)).hostname }`)).json()).links.filter(e => e.rel === 'remotestorage')[0].href
});
