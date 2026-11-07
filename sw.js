const CACHE='mg-gym-v5'
const SHELL=['./','index.html','config.js','vendor/supabase.js','vendor/591.supabase.js','icon-180.png','icon-192.png','manifest.webmanifest',"img/benches.jpg","img/cable.jpg","img/cablebench.jpg","img/cables2.jpg","img/cardio.jpg","img/dbarea.jpg","img/dumbbells.jpg","img/legpress.jpg","img/plate.jpg","img/plate2.jpg","img/platerow.jpg","img/racks.jpg","img/turf.jpg"]
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()})
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()})
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url)
  if(e.request.method!=='GET'||u.origin!==location.origin)return
  if(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('config.js')){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))
  }else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
})
