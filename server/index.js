const express = require('express')
const http = require('http')
const { WebSocketServer } = require('ws')
require('express')().use(require('cors')({origin:'*'})).use(require('express').json()).use(require('compression')()).use(require('helmet')({contentSecurityPolicy:false}))

const PORT = +process.env.PORT || 4000
const app = express()
const db = {scripts:[],novels:[]}
let seq = 1

app.get('/',(r,e)=>e.json({service:'script-to-novel',status:'online'}))
app.get('/health',(r,e)=>e.json({ok:true}))
app.get('/api/v1/health',(r,e)=>e.json({ok:true}))
app.get('/api/v1/settings',(r,e)=>e.json({}))
app.put('/api/v1/settings',(r,e)=>e.json({saved:true}))
app.get('/api/v1/scripts',(r,e)=>e.json({scripts:db.scripts}))
app.post('/api/v1/scripts',(r,e)=>{
  const s={id:seq++,title:r.body?.title||`Script ${seq}`,status:'uploaded',created_at:new Date().toISOString()}
  db.scripts.push(s)
  e.status(201).json(s)
})
app.get('/api/v1/scripts/:id',(r,e)=>{
  const s=db.scripts.find(x=>String(x.id)===r.params.id)
  e.json(s||{error:'Not Found'})
})
app.get('/api/v1/novels',(r,e)=>e.json({novels:db.novels}))
app.get('/api/v1/novels/:id',(r,e)=>{
  const n=db.novels.find(x=>String(x.id)===r.params.id)
  e.json(n||{error:'Not Found'})
})
app.get('/api/v1/novels/:id/export',(r,e)=>e.send(`# Export ${r.params.id}`))

const srv = http.createServer(app)
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
srv.listen(PORT,()=>console.log(`Listening on ${PORT}`))
