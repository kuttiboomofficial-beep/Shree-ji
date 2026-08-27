// Polyfill for the window.storage API (normally provided by Claude's artifact
// sandbox) so this app keeps working once it's deployed as a standalone site.
// Backed by the browser's localStorage — data stays on the device only.

const PREFIX = "crm_storage:";

function keyFor(key, shared) {
  return `${PREFIX}${shared ? "shared:" : "personal:"}${key}`;
}

window.storage = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(keyFor(key, shared));
    if (raw === null) {
      throw new Error("Key not found: " + key);
    }
    return { key, value: raw, shared };
  },

  async set(key, value, shared = false) {
    localStorage.setItem(keyFor(key, shared), value);
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    const existed = localStorage.getItem(keyFor(key, shared)) !== null;
    localStorage.removeItem(keyFor(key, shared));
    return { key, deleted: existed, shared };
  },

  async list(prefix = "", shared = false) {
    const base = keyFor("", shared);
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey && fullKey.startsWith(base)) {
        const shortKey = fullKey.slice(base.length);
        if (shortKey.startsWith(prefix)) keys.push(shortKey);
      }
    }
    return { keys, prefix, shared };
  },
};
