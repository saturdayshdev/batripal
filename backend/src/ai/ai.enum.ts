export enum AiPrompt {
  STT = 'stt',
  TRIAGE = 'triage',
  DIETETIC = 'dietetic',
  PSYCHOTHERAPY = 'psychotherapy',
}

export enum AgentType {
  TRIAGE = 'triage',
  DIETETIC = 'dietetic',
  PSYCHOTHERAPY = 'psychotherapy',
}

export type AgentResponse = {
  agent: AgentType;
  content: string;
};
