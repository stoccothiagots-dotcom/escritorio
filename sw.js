// Service worker minimo: permite instalar como app e abre a ultima versao salva
// se a internet falhar. Sempre tenta a rede primeiro, para pegar atualizacoes.
const CACHE = 'quadro-v1';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png'];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', ev => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== location.origin) return; // ntfy e fontes passam direto
  ev.respondWith(
    fetch(ev.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(ev.request, copia)); return r; })
      .catch(() => caches.match(ev.request))
  );
});
