<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const zh_sens = [
  '居庙堂之高则忧其民，处江湖之远则忧其君。',
  '鹰击长空，鱼翔浅底，万类霜天竞自由。',
  '俱往矣，数风流人物，还看今朝。',
  '俏也不争春，只把春来报。待到山花烂漫时，她在丛中笑',
  '天行健，君子以自强不息。',
  '山高水长，路远马亡。',
  '山高路远，马亡人亡。',
  '山有木兮木有枝，心悦君兮君不知。',
  '青年一代有理想、有本领、有担当，国家就有前途，民族就有希望。',
  '士不可以不弘毅，任重而道远。',
  '要做出特别的东西 你必须相信它本身就很特别',
]

const en_sens = [
  'To make something special. you just have to believe it\'s special.',
  'Life is half spent before we know what it is.',
  'Seize your youth and unleash infinite possibilities.',
]

const sensList = computed(() => (isZh.value ? zh_sens : en_sens))
const currentSens = computed(() => sensList.value[Math.floor(Math.random() * sensList.value.length)])
</script>

<template>
  <p>{{ currentSens }}</p>
</template>
