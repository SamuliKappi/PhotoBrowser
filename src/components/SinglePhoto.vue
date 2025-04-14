<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const photoId = route.params.id
const photo = ref(null)
const loading = ref(true)
const error = ref(null)
onMounted(async() => {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/photos/${photoId}`)
    if(!res.ok) {
      error.value = true
    }
    const json = await res.json()
    photo.value = json
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
const goBackHome = () => {
  const referrer = document.referrer
  const isInternalReferrer = referrer.includes(window.location.hostname)
  if (isInternalReferrer && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <Button class="back-button" @click="goBackHome">Back to Browser</Button>
  <div v-if="loading">Loading photo...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div class="div1" v-else>
    <h1>{{ photo.title }}</h1>
      <img :src="`https://picsum.photos/id/${photo.id % 1000}/800/800`"
       :alt="photo.url"
        style="max-width: 80%;
         height: auto;"
      />
        <h3>ID: {{ photo.id }}</h3>
        <h3>Album Id: {{ photo.albumId }}</h3>
  </div>
</template>

<style scoped>
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  z-index: 10;
  cursor: pointer;
}
.back-button:hover {
  background-color: #388e3c;
}
h1 {
  margin-top: 50px;
}
.div1 {
  align-items: center;
  display: flex;
  flex-direction: column;
}
.div2 {
  align-items: center;
  display: flex;
  flex-direction: row;
}
</style>