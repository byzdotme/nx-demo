<script setup lang="ts">
// 1. 引入共享模块
import { createGreeting } from '@byzdotme/nx-demo-core';

// 2. 调用共享函数
const greeting = createGreeting('Vue Client');
</script>

<template>
  <div class="demo-container">
    <h1>Nx Monorepo 验证</h1>
    <div class="card">
      <h2>前端调用 Core 结果:</h2>
      <p><strong>内容:</strong> {{ greeting.content }}</p>
      <p><strong>来源:</strong> {{ greeting.source }}</p>
      <p><strong>时间:</strong> {{ greeting.timestamp }}</p>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 800px;
  margin: 50px auto;
  text-align: center;
  font-family: sans-serif;
}
.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
}
</style>