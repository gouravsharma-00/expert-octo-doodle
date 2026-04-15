function acquire() {
  if (window.vscodeApi) return window.vscodeApi;
  // In case main html didn't set it (defensive)
  // eslint-disable-next-line no-undef
  return acquireVsCodeApi();
}

const vscodeApi = acquire();

function post(command, payload) {
  const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return new Promise((resolve, reject) => {
    const handler = (e) => {
      const msg = e.data;
      if (!msg || msg.requestId !== requestId) return;
      if (msg.command === `${command}Result`) {
        window.removeEventListener('message', handler);
        resolve({ data: msg.data });
      } else if (msg.command === `${command}Error`) {
        window.removeEventListener('message', handler);
        reject({ response: { data: { message: msg.error } } });
      }
    };
    window.addEventListener('message', handler);
    vscodeApi.postMessage({ command, requestId, payload });
  });
}

const API = {
  post: async (path, payload) => {
    const token = localStorage.getItem('token');

    if (path === '/auth/register') {
      const res = await post('auth.register', payload);
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', res.data.email);
        await post('auth.cacheToken', { token: res.data.token });
      }
      return res;
    }

    if (path === '/auth/login') {
      const res = await post('auth.login', payload);
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('email', res.data.email);
        await post('auth.cacheToken', { token: res.data.token });
      }
      return res;
    }

    if (path === '/debug/analyze') {
      return await post('debug.analyze', { ...payload, token });
    }

    // NL debug used a hardcoded URL in the old app; normalize it here
    if (path === '/nl-debug') {
      return await post('nlDebug.analyze', { ...payload, token });
    }

    throw new Error(`Unsupported API.post path: ${path}`);
  },

  get: async (path) => {
    const token = localStorage.getItem('token');
    if (path === '/history') {
      return await post('history.get', { token });
    }
    throw new Error(`Unsupported API.get path: ${path}`);
  },

  delete: async (path) => {
    const token = localStorage.getItem('token');
    const m = /^\/history\/(.+)$/.exec(path);
    if (m) {
      return await post('history.delete', { token, id: m[1] });
    }
    throw new Error(`Unsupported API.delete path: ${path}`);
  }
};

export default API;

