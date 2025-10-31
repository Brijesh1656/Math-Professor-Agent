
export enum Role {
  USER = 'user',
  AGENT = 'agent',
}

export enum AppState {
  IDLE = 'idle',
  LOADING = 'loading',
}

export enum KnowledgeSource {
  KNOWLEDGE_BASE = 'Knowledge Base',
  WEB_SEARCH = 'Web Search',
}

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: number;
  text: string;
  role: Role;
  sources?: Source[];
  isError?: boolean;
  isLoading?: boolean;
  knowledgeSource?: KnowledgeSource;
  isRefined?: boolean;
  extractedQuestions?: string[];
}
