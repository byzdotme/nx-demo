import express from 'express';
import * as path from 'path';
// 引入两个库
import { AgileTask } from '@demo/core';
import { validateTask } from '@demo/validation';

const app = express();
app.use(express.json()); // 必须开启 JSON 解析

// 模拟内存数据库
let tasks: AgileTask[] = [];

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 获取任务列表
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// 创建任务
app.post('/api/tasks', (req, res) => {
  const body = req.body as Partial<AgileTask>;
  
  // 1. 使用共享模块进行校验
  const validation = validateTask(body);

  if (!validation.isValid) {
    // 校验失败，返回 400 和建议
    return res.status(400).json(validation);
  }

  // 2. 校验通过，创建任务
  const newTask: AgileTask = {
    id: Date.now().toString(),
    title: body.title!,
    points: body.points!,
    createdAt: new Date()
  };

  tasks.push(newTask);
  console.log(`[Server] 创建任务成功: ${newTask.title} (${newTask.points} pts)`);
  
  res.status(201).json(newTask);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api/tasks`);
});
server.on('error', console.error);