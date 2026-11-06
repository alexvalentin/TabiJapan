const V='tabi-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function swr(req,key){
  return caches.open(V).then(c=>c.match(key||req).then(hit=>{
    const net=fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(key||req,res.clone());return res;}).catch(()=>hit);
    return hit||net;
  }));
}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith(swr(r,'./index.html'));return;}
  if(u.origin===location.origin||u.hostname.endsWith('googleapis.com')||u.hostname.endsWith('gstatic.com')){e.respondWith(swr(r));}
});
