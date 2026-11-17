import { useState } from "react";
import { useSAN } from "../features/san/SANContext";

export default function FloatingSAN() {
  const {state}=useSAN();
  const [open,setOpen]=useState(false);
  const [command,setCommand]=useState("");
  function submit(e){
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("san:command",{detail:command.trim()}));
    setCommand("");setOpen(false);
  }
  return <>
    <button className={`san-widget san-${state.mode}`} onClick={()=>setOpen(v=>!v)} aria-label="打开 SAN 指令输入">
      <span className="eyebrow">SAN</span><strong>{state.sanDisplay}</strong>
      <div className="san-bar"><div className="san-bar-fill" style={{width:`${Math.max(0,Math.min(100,state.sanValue))}%`}} /></div>
    </button>
    {open&&<div className="san-dialog"><p>bar正文：&amp;%…*@#&amp;</p><form onSubmit={submit} className="stack"><input className="field" value={command} onChange={e=>setCommand(e.target.value)} placeholder="¥%#@.°" autoFocus maxLength={30}/><button className="button" type="submit">TRANSMIT</button><small className="muted">输入某些名字，也许会发生变化。</small></form></div>}
  </>;
}
