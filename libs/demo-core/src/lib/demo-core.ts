// 这是一个前后端通用的数据接口
export interface SharedMessage {
  source: string;
  content: string;
  timestamp: Date;
}

// 这是一个通用的工具函数
export function createGreeting(name: string): SharedMessage {
  return {
    source: 'demo-core',
    content: `你好，${name}！这是来自 Shared Library 的消息。`,
    timestamp: new Date(),
  };
}