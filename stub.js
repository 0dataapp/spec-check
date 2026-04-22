const mod = {

	tid: () => Math.random().toString(36).replace('0.', new Date().toJSON().replace(/\D/g, '')),

	document: (key, value) => ({
		[key || mod.tid()]: value || mod.tid(),
	}),

	origin: () => `https://${ Math.random().toString(32) }`,

	listing: () => ({
		'@context': 'http://remotestorage.io/spec/folder-description',
		items: {},
	}),

	state: params => Object.assign({
		server: mod.origin(),
		account_handle: mod.tid(),
		scope: 'api-test-suite',
		token_read_write: mod.tid(),
		token_read_only: mod.tid(),
		token_global: mod.tid(),
		baseURL: mod.origin(),
		spec_version: 13,
	}, params || {})

};

export default mod;
