import { CHARACTERS } from "./quizData";

export function calculateQuizResult(answers) {
  if (!Array.isArray(answers) || answers.length !== 5) return { type:"INVALID", character:null };
  if (answers.some((answer) => answer === "GLITCH")) return { type:"GLITCH", character:null };
  const first = answers[0];
  if (!CHARACTERS[first] || !answers.every((answer) => answer === first)) return { type:"GLITCH", character:null };
  return { type:"NORMAL", character:CHARACTERS[first] };
}
