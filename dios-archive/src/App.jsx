import { useEffect, useState } from "react";
import { useSAN } from "./features/san/SANContext";
import Quiz from "./features/quiz/Quiz";
import FloatingSAN from "./components/FloatingSAN";
import Guestbook from "./components/Guestbook";
import DoodleBoard from "./components/DoodleBoard";
import Admin from "./components/Admin";

export default function App(){
  const {state,dispatch}=useSAN();
  const [toast,setToast]=useState("");
  const [showAdmin,setShowAdmin]=useState(false);
  useEffect(()=>{
    const listener=e=>{setToast(e.detail);window.setTimeout(()=>setToast(""),2600);};
    window.addEventListener("archive:toast",listener);
    return()=>window.removeEventListener("archive:toast",listener);
  },[]);
  return <div className={`site-shell ${state.awareness?"awakened":""} ${state.glitchActive?"screen-glitch":""}`}>
    <div className="awareness-overlay"><div><h2>You're aware...</h2><p>Awareness unlocked.</p></div></div>
    {state.unlocked&&<FloatingSAN/>}
    <header className="container topbar"><a className="brand" href="#">DIO'S ARCHIVE</a><nav className="nav-links"><a href="#about">ABOUT</a><a href="#quiz">QUIZ</a><a href="#guestbook">GUESTBOOK</a><a href="#doodle">DOODLE</a><a href="#spoiler">SPOILER</a></nav></header>
    <main>
      <section className="container hero">
        <div><div className="eyebrow">PERSONAL FILE · NO. 001</div><h1>Welcome to<br/>my archive.</h1><p>这里收藏着一些关于我的碎片：喜欢的事物、奇怪的灵感、尚未整理的记忆，以及偶尔不太应该被发现的东西。</p><div className="row" style={{justifyContent:"center"}}><a className="button" href="#about" style={{textDecoration:"none"}}>进入档案</a><a className="button secondary" href="#quiz" style={{textDecoration:"none"}}>开始测试</a></div></div>
        <div className="hero-seal"><div className="seal-inner">D</div></div>
      </section>
      <section className="container section" id="about"><div className="section-heading"><div className="eyebrow">01 / IDENTITY</div><h2>关于档案持有人</h2><p>把下面的示例文字换成你自己的介绍即可。</p></div><div className="panel"><h3>你好，陌生人。</h3><p>我是这里的档案管理员。喜欢艺术、游戏、故事，以及那些藏在日常缝隙里的小小异常。</p><div className="profile-grid"><div className="profile-item"><small>称呼</small><strong>你的昵称</strong></div><div className="profile-item"><small>兴趣</small><strong>绘画 / 音乐 / 游戏</strong></div><div className="profile-item"><small>当前状态</small><strong>正在收集灵感</strong></div></div></div></section>
      <section className="container section" id="quiz"><div className="section-heading"><div className="eyebrow">02 / PSYCHOLOGICAL TEST</div><h2>你获得了哪个时期的迪奥？</h2><p>请凭直觉作答。不要试图理解每一个选项。</p></div><div className="panel"><Quiz onGlitch={()=>dispatch({type:"UNLOCK"})}/></div></section>
      <section className="container section" id="guestbook"><div className="section-heading"><div className="eyebrow">03 / VISITOR LOG</div><h2>访客留言板</h2><p>留下一点文字，或者一张小小的图像。</p></div><Guestbook/></section>
      <section className="container section" id="doodle"><div className="section-heading"><div className="eyebrow">04 / DRAWING ROOM</div><h2>随笔图画板</h2><p>随手画点什么吧。你的笔迹会留在这里。</p></div><DoodleBoard/></section>
      <section className="container section" id="spoiler"><div className="section-heading"><div className="eyebrow">05 / CLASSIFIED</div><h2>剧透！！</h2><p>你已经走到了档案的最深处。</p></div><div className="panel"><details><summary>打开封存文件</summary><p>有些答案并不属于任何一种结果。有些门只有在你选择错误时才会打开。</p><p className="muted">档案编号：DIO-000 / 状态：未完成</p></details></div></section>
      <section className="container section" id="admin"><div className="row" style={{justifyContent:"space-between"}}><div><div className="eyebrow">PRIVATE ACCESS</div><h2>管理入口</h2></div><button className="button secondary" onClick={()=>setShowAdmin(v=>!v)}>{showAdmin?"收起":"打开管理员面板"}</button></div>{showAdmin&&<div style={{marginTop:18}}><Admin/></div>}</section>
    </main>
    <footer className="container footer">DIO'S ARCHIVE · A PRIVATE LITTLE UNIVERSE<br/><span>Some files are better left unopened.</span></footer>
    {toast&&<div className="toast-message">{toast}</div>}
  </div>;
}
