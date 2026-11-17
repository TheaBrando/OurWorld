import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "./quizData";
import { calculateQuizResult } from "./quizEngine";

const GLITCH_WORDS = ["I SEE YOU", "DON'T LOOK BACK", "¥%#@.°", "THE ANSWER IS WATCHING"];

export default function Quiz({ onGlitch }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [word, setWord] = useState(GLITCH_WORDS[0]);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function choose(type) {
    const next = [...answers, type];
    setAnswers(next);
    if (index < 4) { setIndex(index + 1); return; }
    const final = calculateQuizResult(next);
    setResult(final);
    if (final.type === "GLITCH") {
      setPhase("corruption");
      setWord(GLITCH_WORDS[Math.floor(Math.random() * GLITCH_WORDS.length)]);
      timers.current.push(setTimeout(() => setPhase("collapse"), 2300));
      timers.current.push(setTimeout(() => { setPhase("note"); onGlitch?.(); }, 3200));
    } else setPhase("result");
  }

  function restart() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setIndex(0); setAnswers([]); setResult(null); setPhase("idle");
  }

  return (
    <div className={`quiz-box ${phase === "corruption" ? "quiz-corruption" : ""} ${phase === "collapse" ? "quiz-collapse" : ""}`}>
      {phase === "idle" && <>
        <div className="row" style={{justifyContent:"space-between"}}><span className="eyebrow">PERSONALITY ARCHIVE</span><span className="muted">{index + 1} / 5</span></div>
        <div className="quiz-progress"><span style={{width:`${(index + 1) * 20}%`}} /></div>
        <h3>{QUESTIONS[index].title}</h3>
        <div className="quiz-options">
          {QUESTIONS[index].options.map((option, i) => <button className="quiz-option" key={`${index}-${i}`} onClick={() => choose(option.type)}>{option.text}</button>)}
        </div>
      </>}
      {phase === "result" && result?.character && <div className="result-layout">
        <img className="result-art" src={result.character.image} alt={result.character.name} draggable />
        <div><span className="eyebrow">YOUR DIO IS</span><h2>{result.character.name}</h2><p>{result.character.quote}</p><a href="#spoiler">好奇世界的真相吗？</a><div style={{marginTop:20}}><button className="button" onClick={restart}>再次测试</button></div></div>
      </div>}
      {phase === "corruption" && <div style={{textAlign:"center",padding:"50px 10px"}}><div className="eyebrow">FATAL CONTRADICTION</div><h2 style={{fontFamily:"var(--font-mono)",fontSize:"clamp(1.4rem,5vw,3rem)"}}>{word}</h2><p>不要相信你所选择的答案。</p><div style={{fontSize:54,color:"#c01830",textShadow:"0 0 25px red"}}>◉</div><p>I AM WATCHING YOU</p></div>}
      {phase === "collapse" && <div style={{padding:70,textAlign:"center"}}><h2>ERROR_404</h2></div>}
      {phase === "note" && <button className="faded-note" onClick={() => window.dispatchEvent(new Event("note:clicked"))}><img src="/images/effects/faded-note.svg" alt="正在开发中，敬请期待" /></button>}
    </div>
  );
}
