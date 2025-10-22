<template>
  <div class="step-card" :class="{ active }">
    <div class="step-header">
      <div class="step-number">{{ stepNumber }}</div>
      <h2 class="step-title">{{ step.title }}</h2>
    </div>
    
    <div class="step-content">
      <p>{{ step.content }}</p>
    </div>
    
    <div v-if="step.quiz && active" class="quiz-container">
      <div class="quiz-question">{{ step.quiz.question }}</div>
      <div class="quiz-options">
        <QuizOption
          v-for="(option, index) in step.quiz.options"
          :key="index"
          :option="option"
          :show-answer="showAnswer"
          :disabled="answerSelected"
          @select="handleOptionSelect"
        />
      </div>
    </div>
    
    <div class="step-animation">
      <div class="animation-icon">{{ step.animation }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import QuizOption from '../ui/QuizOption.vue'

export default {
  name: 'StepCard',
  components: {
    QuizOption
  },
  props: {
    step: {
      type: Object,
      required: true
    },
    stepNumber: {
      type: Number,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  emits: ['answer-selected'],
  setup(props, { emit }) {
    const showAnswer = ref(false)
    const answerSelected = ref(false)
    
    const handleOptionSelect = (option) => {
      if (answerSelected.value) return
      
      answerSelected.value = true
      showAnswer.value = true
      
      setTimeout(() => {
        emit('answer-selected', option.correct)
      }, 1200)
    }
    
    return {
      showAnswer,
      answerSelected,
      handleOptionSelect
    }
  }
}
</script>

<style scoped>
.step-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0.5;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.step-card.active {
  opacity: 1;
  transform: scale(1);
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.step-number {
  background: #ffcc00;
  color: #000;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  box-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
  font-size: 0.9rem;
}

.step-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.step-content {
  text-align: left;
  line-height: 1.4;
  font-size: 0.95rem;
  margin-bottom: 10px;
}

.quiz-container {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
}

.quiz-question {
  font-size: 1rem;
  margin-bottom: 8px;
}

.quiz-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.step-animation {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.animation-icon {
  font-size: 2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@media (max-width: 600px) {
  .quiz-options {
    grid-template-columns: 1fr;
  }
}
</style>