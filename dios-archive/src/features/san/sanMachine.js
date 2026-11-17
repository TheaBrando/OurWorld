export const initialSANState = {
  sanValue:50, sanDisplay:"50%", mode:"normal", awareness:false,
  noteLocked:false, glitchActive:false, unlocked:false
};
export const SAN_COMMANDS = {
  "迪奥":{value:96.7,display:"96.7%",mode:"high"},
  "西娅":{value:96.67,display:"96.67%",mode:"high"},
  "抹茶雪糕":{display:"抹茶🍵",mode:"special"},
  "蕾莎塔":{display:"蕾三草☘️",mode:"special"},
  "精神连接":{value:10,display:"10%",mode:"critical"}
};
export function sanReducer(state, action) {
  switch(action.type) {
    case "UNLOCK": return {...state,unlocked:true};
    case "EXECUTE_COMMAND": {
      const c=SAN_COMMANDS[action.command];
      if(!c) return state;
      return {...state,sanValue:c.value ?? state.sanValue,sanDisplay:c.display,mode:c.mode,awareness:true};
    }
    case "END_AWARENESS": return {...state,awareness:false};
    case "START_GLITCH": return {...state,glitchActive:true};
    case "END_GLITCH": return {...state,glitchActive:false};
    case "LOCK_NOTE": return {...state,noteLocked:true};
    default:return state;
  }
}
