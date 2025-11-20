<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AgileTask, ValidationResult } from '@demo/core';
import { validateTask } from '@demo/validation';

// 状态
const taskList = ref<AgileTask[]>([]);
const form = ref({
  title: '',
  points: 0
});
const serverError = ref('');

// --- 核心交互：实时前端校验 ---
// 利用 computed 属性，每次输入变化时自动调用共享库
const validationState = computed<ValidationResult>(() => {
  return validateTask({
    title: form.value.title,
    points: form.value.points
  });
});

// 自动修正功能：点击建议值时触发
const applySuggestion = () => {
  if (validationState.value.suggestion) {
    form.value.points = validationState.value.suggestion;
  }
};

// 获取列表
const fetchTasks = async () => {
  const res = await fetch('/api/tasks');
  taskList.value = await res.json();
};

// 提交任务
const submitTask = async () => {
  // 前端双重防线：如果校验不通过，禁止提交
  if (!validationState.value.isValid) return;

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (!res.ok) {
      const errorData = await res.json();
      serverError.value = `后端拒绝: ${errorData.errorMsg}`;
      return;
    }

    // 成功
    serverError.value = '';
    form.value.title = '';
    form.value.points = 0;
    await fetchTasks(); // 刷新列表
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchTasks);
</script>

<template>
  <div class="container">
    <h1>斐波那契任务板</h1>
    
    <div class="card form-card">
      <h3>新建任务</h3>
      
      <div class="form-group">
        <label>任务标题:</label>
        <input v-model="form.title" placeholder="输入任务内容..." />
      </div>

      <div class="form-group">
        <label>预估点数 (Fibonacci):</label>
        <input type="number" v-model.number="form.points" />
        
        <div v-if="!validationState.isValid && form.points !== 0" class="error-box">
          <span class="error-msg">❌ {{ validationState.errorMsg }}</span>
          
          <button 
            v-if="validationState.suggestion" 
            @click="applySuggestion" 
            class="suggestion-btn"
          >
            使用最近的有效值: {{ validationState.suggestion }}
          </button>
        </div>
      </div>

      <button 
        @click="submitTask" 
        :disabled="!validationState.isValid"
        class="submit-btn"
      >
        创建任务
      </button>
      
      <p v-if="serverError" class="server-error">{{ serverError }}</p>
    </div>

    <div class="task-list">
      <div v-for="task in taskList" :key="task.id" class="task-item">
        <div class="point-badge">{{ task.points }}</div>
        <div class="task-info">
          <h4>{{ task.title }}</h4>
          <small>{{ new Date(task.createdAt).toLocaleString() }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 40px auto; font-family: sans-serif; }
.card { border: 1px solid #eee; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }

.error-box { background: #fff0f0; padding: 10px; border-radius: 6px; margin-top: 5px; display: flex; align-items: center; justify-content: space-between;}
.error-msg { color: #d32f2f; font-size: 14px; }
.suggestion-btn { background: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }

.submit-btn { width: 100%; padding: 12px; background: #2e7d32; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }

.task-list { margin-top: 30px; display: flex; flex-direction: column; gap: 10px; }
.task-item { display: flex; align-items: center; background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; }
.point-badge { background: #1976d2; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; }
.task-info h4 { margin: 0 0 5px 0; }
.server-error { color: red; margin-top: 10px; text-align: center; }
</style>