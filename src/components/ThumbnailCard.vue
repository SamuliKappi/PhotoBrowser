<script setup>
import { RouterLink } from 'vue-router'
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  albumId: {
    type: Number,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url : {
    type: String,
    required: true
  }
})
</script>

<template>
  <RouterLink :to="{ name: 'singlePhoto', params: {id: id}}">
    <div class="thumbnail-card">
      <p>ID: {{ id }}</p>
      <h3>{{ title }}</h3>
      <img :src="thumbnailUrl" :alt="thumbnailUrl">
    </div>
  </RouterLink>
  
</template>

<style scoped>
.thumbnail-card {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
}
.thumbnail-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
img {
  max-width: 100%;
  max-height: 100px;
  object-fit: contain;
  margin-bottom: 8px;
}

h3 {
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
