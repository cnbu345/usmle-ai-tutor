import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // Make sure you have router setup
import { createPinia } from 'pinia'  // Required for state management
import './assets/style.css'

// PrimeVue Setup
import PrimeVue from 'primevue/config';


// PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ToastService from 'primevue/toastservice';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Divider from 'primevue/divider'
import Message from 'primevue/message'

// Initialize the app
const app = createApp(App)

// Register plugins
app.use(PrimeVue)
app.use(createPinia())
app.use(router)
app.use(ToastService)

// Register components
app.component('Button', Button)
app.component('Card', Card)
app.component('SelectButton', SelectButton)
app.component('ProgressSpinner', ProgressSpinner)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Divider', Divider)
app.component('Message', Message)

// Mount the app
app.mount('#app')