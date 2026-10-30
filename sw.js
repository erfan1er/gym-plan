/* Versioned local shell; external tutorials are opened online. */
const CACHE='gymplan-pro-20261030-1';
const SHELL=['./','./index.html','./manifest.webmanifest','./assets/fonts/Vazirmatn-var.woff2','./assets/fonts/JetBrainsMono-var.woff2','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png','./assets/favicon-32.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('gymplan-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||!request.url.startsWith(self.registration.scope))return;
  if(request.mode==='navigate'){
    const response=fetch(request).then(async res=>{
      if(!res.ok)throw new Error('Navigation unavailable');
      const cache=await caches.open(CACHE);await cache.put('./index.html',res.clone());return res;
    }).catch(()=>caches.match('./index.html').then(hit=>hit||caches.match('./')));
    event.respondWith(response);return;
  }
  const fresh=fetch(request).then(async res=>{
    if(res.ok&&res.type==='basic'){const cache=await caches.open(CACHE);await cache.put(request,res.clone());}
    return res;
  });
  event.waitUntil(fresh.catch(()=>{}));
  event.respondWith(caches.match(request).then(hit=>hit||fresh));
});
