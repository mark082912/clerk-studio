/* Clerk Studio offline public-shell cache. No patient or personal data stored in CacheStorage. */
'use strict';
const CACHE='clerk-studio-static-v4-0-20261030';
const ASSETS=[
  './','./index.html',
  './pediatric-bank.js?v=14',
  './official-ped-1152.js?v=31',
  './official-ped-1152-extra.js?v=32',
  './official-ped-1151.js?v=20',
  './official-ped-1142.js?v=20',
  './official-ped-1141.js?v=22',
  './rotation-atlas.js?v=40',
  './rotation-exams.js?v=40',
  './rotation-official-1152.js?v=40',
  './dashboard.js?v=40',
  './exam-pro.js?v=40',
  './exam-index.js?v=32',
  './clinical-data.js?v=2',
  './clinical-workbench.js?v=3',
  './rotation-review.js?v=40',
  './manifest.webmanifest','./app-icon.svg'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('clerk-studio-static-')&&key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone());}
      return response;
    }).catch(async ()=>{
      const cache=await caches.open(CACHE);
      return (await cache.match('./index.html'))||(await cache.match('./'))||Response.error();
    }));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(async response=>{
    if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}
    return response;
  })));
});
