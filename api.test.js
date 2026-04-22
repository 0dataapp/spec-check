import { expect } from 'chai';
import { join, dirname, basename } from 'path';
import util from './util.js';
import stub from './stub.js';
import { generate } from './generate.js';
import { readFile } from 'node:fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: `.env${ process.env.ENV ? `.${ process.env.ENV }` : '' }` });

const State = {};

const populate = () => Object.assign(State, {
	server: process.env.SERVER_URL,
	account_handle: process.env.ACCOUNT_HANDLE,
	scope: process.env.TOKEN_SCOPE || 'api-test-suite',
	token_read_write: process.env.TOKEN_READ_WRITE,
	token_read_only: process.env.TOKEN_READ_ONLY,
	token_global: process.env.TOKEN_GLOBAL,
	spec_version: process.env.SPEC_VERSION,
});

populate();

before(async () => {
	if (typeof window !== 'undefined')
		populate();

	State.webfinger = await util.webfinger.discover(State.server, State.account_handle);
	State.baseURL = State.webfinger.href;
	State.storage = util.storage(Object.assign(util.clone(State), {
		token: State.token_read_write,
	}));

	if ([undefined, ''].includes(State.spec_version))
		State.spec_version = util.webfinger.version(State.webfinger);
});

after(function () {
	const erase = async (path, storage) => {
		const list = await storage.get(path);
		
		if (list.status === 404)
			return
		
		const body = await list.json();
		const entries = Object.entries(State.spec_version >= 2 ? body.items : body);
		await Promise.all(entries.map(([key, value]) => {
			const _path = path + key;
			return _path.endsWith('/') ? erase(_path, storage) : storage.delete(_path);
		}));
	};

	erase('/', State.storage);

	erase('/', util.storage(Object.assign(util.clone(State), {
		scope: `public/${ State.scope }`,
		token: State.token_read_write,
	})));

	erase('/', util.storage(Object.assign(util.clone(State), {
		token: State.token_global,
		scope: `${ State.scope }-global/`,
	})));
});

generate({
	describe,
	it,
	expect,
	State,
});
