<script lang="ts" setup>
const loaderState = useLoader();
</script>

<template>
  <div v-if="loaderState.enabled" class="loader">
    <div class="spinner"></div>
  </div>
</template>

<style>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgb(255 255 255 / 95%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid #ccc;
  border-top-color: #333;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
