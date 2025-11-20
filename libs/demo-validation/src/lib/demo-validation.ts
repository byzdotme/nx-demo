import { AgileTask, ValidationResult } from '@demo/core';

export function demoValidation(): string {
  return 'demo-validation';
}

// 预定义的斐波那契数列（简化版）
const FIBONACCI_SEQUENCE = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

/**
 * 查找最近的斐波那契数
 */
function findClosestFibonacci(num: number): number {
  return FIBONACCI_SEQUENCE.reduce((prev, curr) => {
    return Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev;
  });
}

/**
 * 校验任务数据的核心函数
 * 规则：
 * 1. 标题不能为空
 * 2. 点数必须在斐波那契数列中
 */
export function validateTask(task: Partial<AgileTask>): ValidationResult {
  if (!task.title || task.title.trim() === '') {
    return { isValid: false, errorMsg: '任务标题不能为空' };
  }

  if (task.points === undefined || task.points === null) {
    return { isValid: false, errorMsg: '必须设置估算点数' };
  }

  if (!FIBONACCI_SEQUENCE.includes(task.points)) {
    const suggestion = findClosestFibonacci(task.points);
    return {
      isValid: false,
      errorMsg: `点数 ${task.points} 不符合斐波那契规则`,
      suggestion: suggestion
    };
  }

  return { isValid: true };
}