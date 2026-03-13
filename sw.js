const CACHE_NAME = 'poker-memo-v2'; // ★コードを大きく変更した時は、ここのv2をv3, v4...と変えると確実です
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// 新しいバージョンになった時、古いキャッシュを消す
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ★ネットワーク優先（オンラインなら常に最新を取得し、オフラインならキャッシュを返す）
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});