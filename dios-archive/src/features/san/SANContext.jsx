import { createContext, useContext, useEffect, useReducer } from "react";
import { initialSANState, sanReducer, SAN_COMMANDS } from "./sanMachine";

const Context = createContext(null);
export function SANProvider({children}) {
  const [state,dispatch]=useReducer(sanReducer,initialSANState);

  useEffect(()=>{
    const onCommand=(event)=>{
      if (SAN_COMMANDS[event.detail]) dispatch({type:"EXECUTE_COMMAND",command:event.detail});
    };
    const onNote=()=>{
      if(state.noteLocked) return;
      dispatch({type:"START_GLITCH"});
      const message=state.sanValue >= 50 ? "……还是不要去探究为好。" : "我不敢再看了。";
      window.setTimeout(()=>{
        dispatch({type:"END_GLITCH"});
        window.dispatchEvent(new CustomEvent("archive:toast",{detail:message}));
        dispatch({type:"LOCK_NOTE"});
      },550);
    };
    window.addEventListener("san:command",onCommand);
    window.addEventListener("note:clicked",onNote);
    return ()=>{window.removeEventListener("san:command",onCommand);window.removeEventListener("note:clicked",onNote);};
  },[state.noteLocked,state.sanValue]);

  useEffect(()=>{
    if(!state.awareness) return;
    const timer=window.setTimeout(()=>dispatch({type:"END_AWARENESS"}),2600);
    return ()=>window.clearTimeout(timer);
  },[state.awareness]);

  return <Context.Provider value={{state,dispatch}}>{children}</Context.Provider>;
}
export function useSAN(){const value=useContext(Context);if(!value)throw new Error("useSAN must be inside SANProvider");return value;}
