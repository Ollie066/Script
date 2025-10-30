const exp=require('express'),http=require('http'),{WebSocketServer}=require('ws')
const app=exp()
app.use(require('cors')({origin:'*'})).use(exp.json()).use(require('compression')()).use(require('helmet')({contentSecurityPolicy:false}))
const db={scripts:[],novels:[]},seq=1
app.get('/',(r,e)=>e.json({status:'ok'})).get('/health',(r,e)=>e.json({ok:true})).get('/api/v1/scripts',(r,e)=>e.json({scripts:db.scripts}))
app.post('/api/v1/scripts',(r,e)=>{
  const s={id:seq++,title:r.body?.title||`Script ${seq}`,created_at:new Date().toISOString()}
  db.scripts.push(s)
  e.status(201).json(s)
})
app.get('/api/v1/scripts/:id',(r,e)=>e.json(db.scripts.find(x=>String(x.id)===r.params.id)||{error:'Not Found'}))
const srv=http.createServer(app)
new WebSocketServer({server:srv,path:'/ws'}).on('connection',ws=>{
  ws.send(JSON.stringify({type:'connected'}))
  ws.on('message',m=>{
    const d=JSON.parse(m)
    if(d.type==='start_generation')[10,30,60,90,100].forEach((p,i)=>setTimeout(()=>{
      ws.send(JSON.stringify({type:'chapter_progress',progress:p}))
      if(p===100)ws.send(JSON.stringify({type:'completed'}))
    },400*(i+1)))
  })
})
srv.listen(+process.env.PORT||4000,()=>console.log('Listening'))
