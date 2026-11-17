import { useEffect, useRef, useState } from "react";
import { addDoodle, listDoodles } from "../services/archiveService";

export default function DoodleBoard(){
  const canvasRef=useRef(null),drawing=useRef(false),history=useRef([]);
  const [color,setColor]=useState("#29202a"),[size,setSize]=useState(4),[eraser,setEraser]=useState(false);
  const [nickname,setNickname]=useState("匿名画手"),[items,setItems]=useState([]),[notice,setNotice]=useState("");
  useEffect(()=>{const c=canvasRef.current;const ctx=c.getContext("2d");ctx.fillStyle="#f2ece3";ctx.fillRect(0,0,c.width,c.height);history.current=[ctx.getImageData(0,0,c.width,c.height)];refresh();},[]);
  async function refresh(){try{setItems(await listDoodles());}catch(e){setNotice(e.message);}}
  function point(e){const r=canvasRef.current.getBoundingClientRect();return {x:(e.clientX-r.left)*canvasRef.current.width/r.width,y:(e.clientY-r.top)*canvasRef.current.height/r.height};}
  function start(e){const c=canvasRef.current; c.setPointerCapture(e.pointerId);drawing.current=true;const p=point(e);const ctx=c.getContext("2d");ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=eraser?"#f2ece3":color;ctx.lineWidth=size*(c.width/c.getBoundingClientRect().width);ctx.lineTo(p.x+.1,p.y+.1);ctx.stroke();}
  function move(e){if(!drawing.current)return;const p=point(e),ctx=canvasRef.current.getContext("2d");ctx.lineTo(p.x,p.y);ctx.stroke();}
  function end(){if(!drawing.current)return;drawing.current=false;const c=canvasRef.current;history.current.push(c.getContext("2d").getImageData(0,0,c.width,c.height));if(history.current.length>40)history.current.shift();}
  function undo(){if(history.current.length<2)return;history.current.pop();canvasRef.current.getContext("2d").putImageData(history.current[history.current.length-1],0,0);}
  function clear(){const c=canvasRef.current,ctx=c.getContext("2d");ctx.fillStyle="#f2ece3";ctx.fillRect(0,0,c.width,c.height);history.current=[ctx.getImageData(0,0,c.width,c.height)];}
  async function send(){setNotice("正在发送…");canvasRef.current.toBlob(async blob=>{try{await addDoodle({nickname,blob});setNotice("涂鸦已送达。");await refresh();}catch(e){setNotice(e.message||"发送失败");}},"image/png");}
  return <div className="stack">
    <div className="panel stack">
      <div className="row"><label>画笔颜色 <input type="color" value={color} onChange={e=>{setColor(e.target.value);setEraser(false);}}/></label><label>粗细 <input type="range" min="1" max="18" value={size} onChange={e=>setSize(Number(e.target.value))}/></label><button className={`button ${eraser?"":"secondary"}`} onClick={()=>setEraser(v=>!v)}>橡皮擦</button><button className="button secondary" onClick={undo}>撤回上一笔</button><button className="button secondary" onClick={clear}>清空</button></div>
      <canvas ref={canvasRef} className="doodle-canvas" width="1000" height="520" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onPointerLeave={end}/>
      <div className="row"><input className="field" style={{maxWidth:220}} value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={40}/><button className="button" onClick={send}>发送涂鸦</button></div>
      {notice&&<small className="muted">{notice}</small>}
    </div>
    <h3>留下的笔迹</h3>
    <div className="profile-grid">{items.map(item=><article className="panel" key={item.id}><img src={item.image_url} alt={`${item.nickname}的涂鸦`} style={{width:"100%",borderRadius:8}}/><small className="muted">{item.nickname}</small></article>)}</div>
  </div>;
}
