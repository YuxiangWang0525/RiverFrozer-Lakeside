<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import MBTISection from '../components/MBTISection.vue'
import CharacterTiles from '../components/CharacterTiles.vue'
import GameCards from '../components/GameCards.vue'
import LinkCards from '../components/LinkCards.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <div class="home-page">
    <HeroSection />
    <MBTISection />
    <CharacterTiles />
    <GameCards />
    <LinkCards />
    <SiteFooter />
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
}
</style>
