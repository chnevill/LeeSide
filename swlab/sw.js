const LAB='lab-1';
// SW update lab: a tiny stand-in for LeeSide's own service worker, living in its own folder so it can never touch the real app.
// It copies the real one's install step (two full downloads of the real index.html, 'reload' mode into its own cache)
// and records how long the install took, so the page can show whether an iPhone finishes it.
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const t0=Date.now(),rec={lab:LAB,steps:[]};
    try{
      const c=await caches.open('swlab-'+LAB);
      for(const u of ['/LeeSide/index.html?lab='+LAB,'/LeeSide/index.html?lab2='+LAB]){
        const t1=Date.now();
        const r=await fetch(u,{cache:'reload'});
        rec.steps.push(u.split('?')[1]+' status '+r.status+' '+(Date.now()-t1)+' ms');
        if(!r.ok)throw new Error('status '+r.status);
        await c.put(u,r);
      }
      rec.ok=true;
    }catch(err){rec.ok=false;rec.err=String(err);}
    rec.total=Date.now()-t0;
    const c2=await caches.open('swlab-log');
    await c2.put('/LeeSide/swlab/installlog-'+LAB,new Response(JSON.stringify(rec)));
    if(!rec.ok)throw new Error(rec.err);
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()){if(k.indexOf('swlab-lab')===0&&k!=='swlab-'+LAB)await caches.delete(k);}
    await self.clients.claim();
  })());
});
self.addEventListener('message',e=>{
  if(e.data==='skipWaiting')self.skipWaiting();
  if(e.data==='version'&&e.source)e.source.postMessage({version:LAB});
});
