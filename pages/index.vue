<template>
  <div>
    <form class="space-y-2 flex flex-col" @submit.prevent="submitForm">
      <h2 class="text-xl mb-4">Создать новую комнату</h2>
      <GInput label="Название комнаты" v-model="roomName" />
      <GButton>Создать</GButton>
    </form>

    <div class="flex flex-col space-y-3 mt-24">
      <h2 class="text-xl mb-4">Присоединиться</h2>

      <GButton
        tag="a"
        :href="`/rooms/${id}`"
        outline
        v-for="{ id, name } in rooms"
        :key="id"
      >
        {{ name }}
      </GButton>

      <p v-if="rooms.length === 0">
        На данный момент нет открытых комнат, но вы можете исправить эту
        ситуацию прямо сейчас!
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import GInput from '~/components/g-input.vue'
  import GButton from '~/components/g-button.vue'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useAsyncData, useHead, useRouter } from '#app'

  useHead({
    title: 'Poky',
  })

  const router = useRouter()

  const roomName = ref('')

  const { data: rooms, refresh: reloadRooms } = await useAsyncData(
    'roomsFromApi',
    () => $fetch('/api/rooms/list'),
  )

  const submitForm = async () => {
    const { id } = await $fetch('/api/rooms/create', {
      method: 'POST',
      body: {
        name: roomName.value,
      },
    })

    await router.push(`/rooms/${id}`)
  }

  const intervalId = ref<NodeJS.Timeout>(null)

  onMounted(() => {
    intervalId.value = setInterval(reloadRooms, 1000)
  })

  onUnmounted(() => {
    clearInterval(intervalId.value)
  })
</script>
