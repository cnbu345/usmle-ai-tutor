<template>
  <div class="quiz-activity">
    <!-- Quiz Header -->
    <div class="quiz-header mb-6">
      <h3 class="text-xl font-semibold">{{ title }}</h3>
      <div class="flex items-center gap-2 mt-2">
        <span class="progress-text">
          Question {{ currentIndex + 1 }} of {{ questions.length }}
        </span>
        <ProgressBar 
          :value="(currentIndex / questions.length) * 100" 
          class="flex-grow"
        />
      </div>
    </div>

    <!-- Current Question -->
    <div v-if="currentQuestion" class="question-card p-4 mb-4">
      <div class="question-text mb-4 font-medium">
        {{ currentQuestion.question }}
      </div>

      <!-- Image Display (if available) -->
      <img 
        v-if="currentQuestion.image" 
        :src="currentQuestion.image" 
        class="question-image mb-4 max-h-48 mx-auto"
      >

      <!-- Options List -->
      <div class="options-grid">
        <div 
          v-for="(option, index) in currentQuestion.options" 
          :key="index"
          class="option-item"
          :class="{
            'selected': selectedAnswer === index,
            'correct': showFeedback && index === currentQuestion.correctAnswer,
            'incorrect': showFeedback && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer
          }"
          @click="selectAnswer(index)"
        >
          <div class="option-letter">
            {{ String.fromCharCode(65 + index) }}
          </div>
          <div class="option-text">
            {{ option }}
          </div>
        </div>
      </div>

      <!-- Feedback Section -->
      <div v-if="showFeedback" class="feedback mt-4 p-3">
        <div class="feedback-icon">
          <i 
            :class="[
              'pi',
              isCorrect ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500'
            ]" 
          />
        </div>
        <div class="feedback-content">
          <div class="feedback-title font-bold">
            {{ isCorrect ? 'Correct!' : 'Incorrect' }}
          </div>
          <div class="feedback-explanation">
            {{ currentQuestion.explanation }}
          </div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <div class="quiz-controls mt-6 flex justify-between">
        <Button 
          label="Previous" 
          icon="pi pi-arrow-left"
          :disabled="currentIndex === 0"
          @click="prevQuestion"
        />
        
        <Button 
          v-if="!showFeedback"
          label="Submit" 
          icon="pi pi-check"
          :disabled="selectedAnswer === null"
          @click="checkAnswer"
        />
        
        <Button 
          v-else
          :label="isLastQuestion ? 'Finish Quiz' : 'Next'" 
          icon="pi pi-arrow-right"
          @click="nextQuestion"
        />
      </div>
    </div>

    <!-- Results Screen -->
    <div v-if="showResults" class="results-screen">
      <div class="results-card">
        <h3 class="results-title">Quiz Complete!</h3>
        <div class="results-score">
          You scored {{ correctCount }} out of {{ questions.length }}
        </div>
        <ProgressBar 
          :value="(correctCount / questions.length) * 100" 
          :showValue="true"
          class="my-4"
        />
        <div class="results-feedback">
          <span v-if="perfectScore" class="perfect-score">
            <i class="pi pi-star-fill mr-2" />
            Perfect! You're ready for the exam!
          </span>
          <span v-else-if="goodScore" class="good-score">
            <i class="pi pi-thumbs-up mr-2" />
            Good work! Review your weak areas.
          </span>
          <span v-else class="improve-score">
            <i class="pi pi-exclamation-triangle mr-2" />
            Keep practicing! Focus on these topics:
          </span>
        </div>
        <Button 
          label="Review Mistakes" 
          icon="pi pi-book"
          class="mt-4"
          @click="reviewMistakes"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'

const props = defineProps({
  questions: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(q => 
        q.question && 
        q.options && 
        q.options.length >= 2 && 
        typeof q.correctAnswer === 'number'
      )
    }
  },
  title: {
    type: String,
    default: 'Quiz'
  }
})

const emit = defineEmits(['quiz-completed', 'review-requested'])

// Quiz State
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const showFeedback = ref(false)
const isCorrect = ref(false)
const userAnswers = ref([])
const showResults = ref(false)

// Computed Properties
const currentQuestion = computed(() => props.questions[currentIndex.value])
const isLastQuestion = computed(() => currentIndex.value === props.questions.length - 1)
const correctCount = computed(() => userAnswers.value.filter(a => a.isCorrect).length)
const perfectScore = computed(() => correctCount.value === props.questions.length)
const goodScore = computed(() => correctCount.value >= props.questions.length * 0.7)

// Methods
const selectAnswer = (index) => {
  if (!showFeedback.value) {
    selectedAnswer.value = index
  }
}

const checkAnswer = () => {
  showFeedback.value = true
  isCorrect.value = selectedAnswer.value === currentQuestion.value.correctAnswer
  
  // Record the answer
  userAnswers.value.push({
    questionIndex: currentIndex.value,
    selectedAnswer: selectedAnswer.value,
    isCorrect: isCorrect.value
  })
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    showResults.value = true
    emit('quiz-completed', {
      score: correctCount.value,
      total: props.questions.length,
      answers: userAnswers.value
    })
  } else {
    currentIndex.value++
    selectedAnswer.value = null
    showFeedback.value = false
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = null
    showFeedback.value = false
  }
}

const reviewMistakes = () => {
  emit('review-requested', userAnswers.value.filter(a => !a.isCorrect))
}
</script>

<style scoped>
.quiz-activity {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-header {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
}

.question-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.question-image {
  max-width: 100%;
  border-radius: 4px;
  object-fit: contain;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.option-item:hover {
  background-color: #f1f5f9;
  transform: translateY(-1px);
}

.option-item.selected {
  background-color: #dbeafe;
  border-color: #93c5fd;
}

.option-item.correct {
  background-color: #dcfce7;
  border-color: #86efac;
}

.option-item.incorrect {
  background-color: #fee2e2;
  border-color: #fca5a5;
}

.option-letter {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e2e8f0;
  border-radius: 50%;
  margin-right: 1rem;
  font-weight: 600;
  flex-shrink: 0;
}

.option-item.selected .option-letter {
  background-color: #3b82f6;
  color: white;
}

.option-item.correct .option-letter {
  background-color: #10b981;
  color: white;
}

.option-item.incorrect .option-letter {
  background-color: #ef4444;
  color: white;
}

.feedback {
  display: flex;
  align-items: flex-start;
  border-radius: 6px;
  background-color: #f8fafc;
}

.feedback-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.feedback-title {
  margin-bottom: 0.25rem;
}

.results-screen {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  text-align: center;
}

.results-title {
  font-size: 1.5rem;
  color: #1e40af;
  margin-bottom: 1rem;
}

.results-score {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.perfect-score {
  color: #10b981;
  font-weight: 600;
}

.good-score {
  color: #3b82f6;
  font-weight: 600;
}

.improve-score {
  color: #ef4444;
  font-weight: 600;
}
</style>