import{createContext,useContext,useMemo,useRef,useState,useEffect}from'react'
import{API_BASE}from'../utils/constants.js'
const AppContext=createContext(null)
export function AppProvider({children}){
  const[currentScript,setCurrentScript]=useState(null),[currentNovel,setCurrentNovel]=useState(null)
  const[apiOnline,setApiOnline]=useState(true),cableRef=useRef(null)
  useEffect(()=>{
    const i=setInterval(async()=>{try{const r=await fetch(`${API_BASE.replace('/api/v1','')}/health`);setApiOnline(r.ok)}catch{setApiOnline(false)}},30000)
    return()=>clearInterval(i)
  },[])
  function connectCable(token){
    if(cableRef.current)return cableRef.current
    const p=location.protocol==='https:'?'wss':'ws',h=location.hostname
    const u=(import.meta.env.VITE_WS_URL)||`${p}://${h}:4000/ws?token=${encodeURIComponent(token||'')}`
    cableRef.current=new WebSocket(u)
    return cableRef.current
  }
  function subscribeToGeneration(scriptId,handlers={}){
    const ws=cableRef.current||connectCable()
    function onM(ev){try{const d=JSON.parse(ev.data);d.type==='chapter_progress'?handlers.onProgress?.(d):d.type==='status_change'?handlers.onStatus?.(d):d.type==='error'?handlers.onError?.(d):d.type==='completed'?handlers.onComplete?.(d):0}catch{}}
    ws.addEventListener('message',onM)
    ws.addEventListener('open',()=>{try{ws.send(JSON.stringify({type:'start_generation',script_id:scriptId}))}catch{}},{once:true})
    return{unsubscribe(){try{ws.removeEventListener('message',onM)}catch{}}}
  }
  const val=useMemo(()=>({currentScript,setCurrentScript,currentNovel,setCurrentNovel,apiOnline,connectCable,subscribeToGeneration}),[currentScript,currentNovel,apiOnline])
  return(<AppContext.Provider value={val}>{children}</AppContext.Provider>)
}
export const useApp=()=>useContext(AppContext)
