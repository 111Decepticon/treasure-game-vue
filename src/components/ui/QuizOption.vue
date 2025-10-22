<template>
  <button 
    class="quiz-option"
    :class="{
      'correct': showAnswer && option.correct,
      'incorrect': showAnswer && !option.correct && selected,
      'disabled': disabled
    }"
    @click="handleClick"
    :disabled="disabled"
  >
    {{ option.text }}
  </button>
</template>

<script>
export default {
  name: 'QuizOption',
  props: {
    option: {
      type: Object,
      required: true
    },
    showAnswer: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  methods: {
    handleClick() {
      this.$emit('select', this.option)
    }
  }
}
</script>

<style scoped>
.quiz-option {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  width: 100%;
}

.quiz-option:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.quiz-option.correct {
  background: #4CAF50;
}

.quiz-option.incorrect {
  background: #f44336;
}

.quiz-option.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>