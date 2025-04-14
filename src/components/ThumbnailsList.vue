<script setup>
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import ThumbnailCard from '../components/ThumbnailCard.vue'
import { usePhotosStore } from '../stores/photos.js'
let observer
const loadMoreTrigger = ref(null)
const store = usePhotosStore()

onMounted(async () => {
  if (performance.getEntriesByType("navigation")[0].type === "reload") {
    window.scrollTo(0, 0)
  }
  if (store.visiblePhotos.length === 0) {
    store.fetchData()
  }
  
  observer = new IntersectionObserver(
    (entries) =>  {
      entries.forEach((entry) => {
        if(entry.isIntersecting && !store.isLoading) {
          store.fetchData()
        }
      })
    },
    {
      rootMargin: '100px',
      threshold: 0
    },
  )
  await nextTick()
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }

})


onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="thumbnail-container">
    <ThumbnailCard
      v-for="photo in store.visiblePhotos"
      :key="photo.id"
      v-bind="photo"
    />
    <div ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="store.isLoading">Loading more photos...</div>
      <div v-if="store.error">Failed loading more images</div>
    </div>
  </div>
</template>

<style scope>
.load-more-trigger {
  width: 100%;
  text-align: center;
}
a {
  padding: 0;
}
a:hover {
  background-color: transparent;
}
.thumbnail-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
}
.load-more-trigger {
  grid-column: 1 / -1;
  text-align: center;
  padding: 16px;
}
</style>