<template>
  <div class="module-view">
    <!-- Back Button -->
    <Button 
      icon="pi pi-arrow-left" 
      label="Back to Dashboard" 
      @click="goBack"
      class="mb-4"
    />

    <!-- Module Title -->
    <h1 class="text-3xl font-bold mb-4">{{ module?.title || 'Loading...' }}</h1>

    <!-- Learning Style Toggle -->
    <div class="learning-style-toggle mb-6">
      <label class="block text-sm font-medium mb-2">Learning Style:</label>
      <SelectButton
        v-model="currentLearningStyle"
        :options="learningStyles"
        optionLabel="name"
        optionValue="value"
        @change="handleStyleChange"
      />
    </div>

    <!-- Content Display -->
    <Card class="mb-6">
      <template #content>
        <!-- Visual Content -->
        <div v-if="currentLearningStyle === 'visual' && module?.visualContent">
          <img 
            :src="module.visualContent.diagramUrl" 
            :alt="module.title + ' diagram'"
            class="w-full max-h-96 object-contain mb-4"
          >
          <div v-html="module.visualContent.explanation"></div>
        </div>

        <!-- Auditory Content -->
        <div v-else-if="currentLearningStyle === 'auditory' && module?.audioContent">
          <audio 
            controls
            :src="module.audioContent.audioUrl"
            class="w-full mb-4"
          ></audio>
          <div class="transcript">
            <h3 class="font-bold mb-2">Transcript:</h3>
            <p>{{ module.audioContent.transcript }}</p>
          </div>
        </div>

        <!-- Kinesthetic Content -->
        <div v-else-if="currentLearningStyle === 'kinesthetic' && module?.kinestheticContent">
          <div class="activity-instructions mb-4">
            <h3 class="font-bold mb-2">Activity:</h3>
            <p>{{ module.kinestheticContent.instructions }}</p>
          </div>
          <QuizActivity 
            :questions="module.kinestheticContent.questions"
            @answer-selected="handleAnswer"
          />
        </div>

        <!-- Loading/Error States -->
        <div v-else-if="loading" class="text-center py-8">
          <ProgressSpinner />
          <p class="mt-2">Loading content...</p>
        </div>
        <div v-else class="text-center py-8 text-red-500">
          <p>Content not available for this learning style.</p>
        </div>
      </template>
    </Card>

    <!-- Quiz Results (if available) -->
    <Card v-if="quizResults" class="mb-6">
      <template #title>Quiz Results</template>
      <template #content>
        <p>Score: {{ quizResults.score }}/{{ quizResults.total }}</p>
        <div v-for="(result, index) in quizResults.details" :key="index" class="mb-2">
          <p><strong>Q{{ index + 1 }}:</strong> {{ result.question }}</p>
          <p :class="result.isCorrect ? 'text-green-500' : 'text-red-500'">
            Your answer: {{ result.userAnswer }} ({{ result.isCorrect ? 'Correct' : 'Incorrect' }})
          </p>
          <p v-if="!result.isCorrect" class="text-sm text-gray-600">
            Correct answer: {{ result.correctAnswer }}
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUSMLEStore } from '../stores/usmle';
import Button from 'primevue/button';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import ProgressSpinner from 'primevue/progressspinner';
import QuizActivity from '../components/QuizActivity.vue';

const route = useRoute();
const router = useRouter();
const usmleStore = useUSMLEStore();

// Data
const loading = ref(true);
const module = ref(null);
const currentLearningStyle = ref('visual');
const quizResults = ref(null);

// Constants
const learningStyles = [
  { name: 'Visual', value: 'visual' },
  { name: 'Auditory', value: 'auditory' },
  { name: 'Kinesthetic', value: 'kinesthetic' }
];

// Computed
const moduleId = computed(() => route.params.id);

// Methods
const fetchModule = async () => {
  try {
    loading.value = true;
    module.value = await usmleStore.fetchModule(moduleId.value);
    // Set initial learning style based on user preference or module default
    currentLearningStyle.value = usmleStore.userLearningStyle || module.value?.defaultStyle || 'visual';
  } catch (error) {
    console.error('Error loading module:', error);
  } finally {
    loading.value = false;
  }
};

const handleStyleChange = (newStyle) => {
  // Save learning style preference to store
  usmleStore.setLearningStyle(newStyle);
};

const handleAnswer = (results) => {
  quizResults.value = {
    score: results.filter(r => r.isCorrect).length,
    total: results.length,
    details: results.map(r => ({
      question: r.question,
      userAnswer: r.userAnswer,
      correctAnswer: r.correctAnswer,
      isCorrect: r.isCorrect
    }))
  };
};

const goBack = () => {
  router.push('/dashboard');
};

// Lifecycle Hooks
onMounted(() => {
  fetchModule();
});
</script>

<style scoped>
.module-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.learning-style-toggle {
  max-width: 400px;
}

.transcript {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.activity-instructions {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
</style>