export type ScoreLevel = "green" | "yellow" | "red";

export function scoreLevel(score: number): ScoreLevel {
  if (score >= 80) return "green";
  if (score >= 50) return "yellow";
  return "red";
}

export function scoreColorClass(score: number): string {
  const level = scoreLevel(score);
  if (level === "green") return "score-green";
  if (level === "yellow") return "score-yellow";
  return "score-red";
}

export function scoreBgClass(score: number): string {
  const level = scoreLevel(score);
  if (level === "green") return "bg-score-green border border-score-green";
  if (level === "yellow") return "bg-score-yellow border border-score-yellow";
  return "bg-score-red border border-score-red";
}

export function scoreStrokeClass(score: number): string {
  const level = scoreLevel(score);
  if (level === "green") return "stroke-score-green";
  if (level === "yellow") return "stroke-score-yellow";
  return "stroke-score-red";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "Needs Work";
  return "Poor";
}
