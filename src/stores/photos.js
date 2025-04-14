import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePhotosStore = defineStore('photos', () => {
  const visiblePhotos = ref([])
  const pageToFetch = ref(1)
  const isLoading = ref(false)
  const error = ref(false)
  const fetchData = async () => {
    isLoading.value = true
    const response = await fetch("https://jsonplaceholder.typicode.com/photos?" + 
      new URLSearchParams({_limit: "20", _page: pageToFetch.value}).toString())

    if (!response.ok) {
      console.log("Response not OK");
      error.value = true
    }
    const json = await response.json()
    visiblePhotos.value = visiblePhotos.value.concat(json)
    pageToFetch.value++
    isLoading.value = false
  }
  return { visiblePhotos, isLoading, error, fetchData }
})
