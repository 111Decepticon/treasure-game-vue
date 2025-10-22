<template>
  <div class="progress-container">
    <div class="progress-label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
        :class="variant"
      ></div>
    </div>
    <div class="progress-text">
      <slot name="text">{{ text }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
    }
  }
}
</script>

<style scoped>
.progress-container {
  margin: 1rem 0;
}

.progress-label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.primary {
  background: #ffcc00;
}

.progress-fill.success {
  background: #4CAF50;
}

.progress-fill.warning {
  background: #ff9800;
}

.progress-fill.danger {
  background: #f44336;
}

.progress-text {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}
</style>