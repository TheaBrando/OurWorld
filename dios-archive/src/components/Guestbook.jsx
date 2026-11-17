import { useEffect, useState } from "react";
import { addGuestbook, listGuestbook } from "../services/archiveService";

export default function Guestbook() {
  const [items,setItems]=useState([]);
  const [nickname,setNickname]=useState("");
  const [message,setMessage]=useState("");
  const [file,setFile]=useState(null);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  async function refresh(){try{setItems(await listGuestbook());}catch(e){setNotice(e.message);}}
  useEffect(()=>{refresh();},[]);
  async function submit(e){
    e.preventDefault();if(!message.trim())return;
    setBusy(true);setNotice("");
    try{await addGuestbook({nickname:nickname.trim(),message:message.trim(),file});setMessage("");setFile(null);e.target.reset();await refresh();setNotice("留言已送达。");}
    catch(err){setNotice(err.message||"发送失败，请稍后再试。");}
    finally{setBusy(false);}
  }
  return <div className="stack">
    <form className="panel stack" onSubmit={submit}>
      <input className="field" value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="你的称呼（可留空）" maxLength={40}/>
      <textarea className="field" rows="4" value={message} onChange={e=>setMessage(e.target.value)} placeholder="在档案室留下几句话……" maxLength={1500} required/>
      <div className="row"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>setFile(e.target.files?.[0]||null)}/><button className="button" disabled={busy}>{busy?"发送中…":"提交留言"}</button></div>
      <small className="muted">图片 / GIF 最大 5MB。请勿上传他人隐私或未经授权的内容。</small>
      {notice&&<small>{notice}</small>}
    </form>
    <div className="stack">{items.map(item=><article className="panel" key={item.id}><div className="row" style={{justifyContent:"space-between"}}><strong>{item.nickname}</strong><small className="muted">{new Date(item.created_at).toLocaleString()}</small></div><p style={{whiteSpace:"pre-wrap"}}>{item.message}</p>{item.image_url&&<img src={item.image_url} alt="访客上传图片" style={{maxWidth:260,borderRadius:10}}/>}</article>)}</div>
    {!items.length&&<p className="muted">这里还没有留言。你可以成为第一个留下痕迹的人。</p>}
  </div>;
}
