<template>
  <LandingPage />
</template>

<script lang="ts">
export default {
  name: 'HomePage',
  components: {
    LandingPage: () => import('@/components/landing/LandingPage.vue'),
  },
  layout() {
    return 'full-width-layout'
  },
}
</script>
