<template>
  <div
    class="rounded-xl select-none cursor-pointer shadow-lg aspect-[3/5] w-full text-4xl flex flex-col space-y-6 justify-center items-center group font-thin hover:scale-110 hover:shadow-2xl transition-all duration-300"
    :class="isSelected && 'ring-4 ring-blue-200'"
  >
    <component
      :is="component"
      class="group-hover:rotate-[360deg] group-hover:scale-150 transition-all duration-300"
    />
    <span>{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
  import { Vote } from '~/shared/domain'
  import ITwemojiRedHeart from '~icons/twemoji/red-heart'
  import ITwemojiSmilingFaceWithHeartEyes from '~icons/twemoji/smiling-face-with-heart-eyes'
  import ITwemojiBeamingFaceWithSmilingEyes from '~icons/twemoji/beaming-face-with-smiling-eyes'
  import ITwemojiUpsideDownFace from '~icons/twemoji/upside-down-face'
  import ITwemojiNeutralFace from '~icons/twemoji/neutral-face'
  import ITwemojiConfusedFace from '~icons/twemoji/confused-face'
  import ITwemojiFaceWithCrossedOutEyes from '~icons/twemoji/face-with-crossed-out-eyes'
  import ITwemojiBirthdayCake from '~icons/twemoji/birthday-cake'
  import { computed } from 'vue'

  const props = defineProps<{
    value: Vote
    isSelected: boolean
  }>()

  const component = computed(() => {
    switch (props.value) {
      case 1:
        return ITwemojiRedHeart
      case 2:
        return ITwemojiSmilingFaceWithHeartEyes
      case 3:
        return ITwemojiBeamingFaceWithSmilingEyes
      case 5:
        return ITwemojiUpsideDownFace
      case 8:
        return ITwemojiNeutralFace
      case 13:
        return ITwemojiConfusedFace
      case 21:
        return ITwemojiFaceWithCrossedOutEyes
      case 34:
        return ITwemojiBirthdayCake
    }
  })
</script>
