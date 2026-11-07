const CACHE='mg-gym-v8'
const SHELL=['./','index.html','config.js','vendor/supabase.js','vendor/591.supabase.js','icon-180.png','icon-192.png','icon-512.png','manifest.webmanifest',"img/benches.jpg","img/cable.jpg","img/cablebench.jpg","img/cables2.jpg","img/cardio.jpg","img/dbarea.jpg","img/dumbbells.jpg","img/legpress.jpg","img/plate.jpg","img/plate2.jpg","img/platerow.jpg","img/racks.jpg","img/turf.jpg"]
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()})
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()})
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url)
  if(e.request.method!=='GET'||u.origin!==location.origin)return
  if(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('config.js')){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))
  }else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))
})
// the server only sends title, text and a tag; a repeat with the same tag replaces the older banner instead of stacking
self.addEventListener('push',e=>{
  const note=e.data?e.data.json():{title:'MG Gym'}
  e.waitUntil(self.registration.showNotification(note.title,{body:note.body,tag:note.tag,icon:'icon-192.png',badge:'icon-192.png',data:{url:note.url||'./'}}))
})
self.addEventListener('notificationclick',e=>{
  e.notification.close()
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(open=>open[0]?open[0].focus():clients.openWindow(e.notification.data.url)))
})
