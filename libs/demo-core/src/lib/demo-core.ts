export interface SharedMessage {
  source: string;
  content: string;
  timestamp: Date;
}

export function createGreeting(name: string): SharedMessage {
  return {
    source: 'demo-core',
    content: `你好，${name}！这是来自 Shared Library 的消息。`,
    timestamp: new Date(),
  };
}

// --- 新增部分 ---

export interface AgileTask {
  id: string;
  title: string;
  points: number; // 必须是斐波那契数
  createdAt: Date;
}

export interface ValidationResult {
  isValid: boolean;
  errorMsg?: string;
  suggestion?: number; // 如果错误，给出建议值
}