import { createGreeting } from './demo-core.js';

describe('createGreeting', () => {
  it('should work', () => {
    expect(createGreeting('mock').content).toEqual('你好，mock！这是来自 Shared Library 的消息。');
  });
});
