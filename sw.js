const CACHE='atlas-diagnostic-fitness-v11';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./sw.js',
  './vendor/jspdf.umd.min.js','./vendor/jspdf.plugin.autotable.min.js','./vendor/chart.umd.min.js'];
const CDNS=[
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
  'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',
  'https://unpkg.com/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await c.addAll(ASSETS);
  await Promise.allSettled(CDNS.map(async u=>{try{const r=await fetch(u,{mode:'no-cors',cache:'no-store'}); if(r) await c.put(u,r);}catch(_){} }));
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(e.request);
    if(cached) return cached;
    try{
      const resp=await fetch(e.request);
      if(new URL(e.request.url).origin===location.origin || CDN_HINTS.some(x=>e.request.url.startsWith(x))){try{await cache.put(e.request,resp.clone());}catch(_) {}}
      return resp;
    }catch(err){
      return cached || (e.request.mode==='navigate' ? cache.match('./index.html') : Response.error());
    }
  })());
});
const CDN_HINTS=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/','https://cdn.jsdelivr.net/npm/jspdf','https://unpkg.com/jspdf','https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/','https://cdn.jsdelivr.net/npm/jspdf-autotable','https://unpkg.com/jspdf-autotable','https://cdnjs.cloudflare.com/ajax/libs/Chart.js/','https://cdn.jsdelivr.net/npm/chart.js'];
