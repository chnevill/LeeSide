// BackLab: bare-minimum worker so Chrome treats the page as an installable app. Caches nothing, changes nothing.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request));});
