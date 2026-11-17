import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../services/supabase";
import { adminLogin, adminLogout, adminDelete, adminSetApproved } from "../services/archiveService";

export default function Admin(){
  const [session,setSession]=useState(null),[email,setEmail]=useState(""),[password,setPassword]=useState("");
  const [guestbook,setGuestbook]=useState([]),[doodles,setDoodles]=useState([]),[error,setError]=useState("");
  async function load(){
    if(!supabase)return;
    const [g,d]=await Promise.all([
      supabase.from("guestbook").select("*").order("created_at",{ascending:false}),
      supabase.from("doodles").select("*").order("created_at",{ascending:false})
    ]);
    if(g.error||d.error)setError(g.error?.message||d.error?.message);
    setGuestbook(g.data||[]);setDoodles(d.data||[]);
  }
  useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>subscription.unsubscribe();},[]);
  useEffect(()=>{if(session)load();},[session]);
  async function login(e){e.preventDefault();try{await adminLogin(email,password);setError("");}catch(e){setError(e.message);}}
  async function remove(table,id){if(!confirm("确定删除这条记录吗？"))return;try{await adminDelete(table,id);load();}catch(e){setError(e.message);}}
  async function approve(table,id,value){try{await adminSetApproved(table,id,value);load();}catch(e){setError(e.message);}}
  if(!isSupabaseConfigured)return <p className="muted">请先配置 Supabase 环境变量，管理员后台才能使用。</p>;
  if(!session)return <form className="panel stack" onSubmit={login}><h3>管理员登录</h3><input className="field" type="email" placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="field" type="password" placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="button">登录</button>{error&&<small>{error}</small>}</form>;
  const rows=[["guestbook",guestbook],["doodles",doodles]];
  return <div className="stack"><div className="row"><strong>档案管理后台</strong><button className="button secondary" onClick={adminLogout}>退出登录</button><button className="button secondary" onClick={load}>刷新</button></div>{error&&<p>{error}</p>}
    {rows.map(([table,items])=><section className="stack" key={table}><h3>{table==="guestbook"?"访客留言":"访客涂鸦"}</h3>{items.map(item=><article className="panel" key={item.id}><div className="row" style={{justifyContent:"space-between"}}><strong>{item.nickname}</strong><small>{new Date(item.created_at).toLocaleString()}</small></div>{item.message&&<p>{item.message}</p>}{item.image_url&&<img src={item.image_url} alt="" style={{maxWidth:240,borderRadius:8}}/>}<div className="row"><button className="button secondary" onClick={()=>approve(table,item.id,!item.approved)}>{item.approved?"隐藏":"审核通过"}</button><button className="button" onClick={()=>remove(table,item.id)}>删除</button></div></article>)}</section>)}
  </div>;
}
