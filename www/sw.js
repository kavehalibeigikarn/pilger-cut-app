// کش آفلاین؛ با هر تغییر در فایل‌ها عدد نسخه را بالا ببرید
const CACHE = 'melt-analysis-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png',
  'fonts/Vazirmatn-Regular.woff2', 'fonts/Vazirmatn-Medium.woff2', 'fonts/Vazirmatn-Bold.woff2', 'fonts/Vazirmatn-ExtraBold.woff2', 'fonts/Vazirmatn-Black.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // صفحه: اول شبکه (برای گرفتن نسخه جدید)، در صورت قطعی از کش
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put('index.html', c)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
