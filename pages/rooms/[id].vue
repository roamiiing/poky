<template>
  <div v-if="roomState" class="flex flex-col">
    <RouterLink
      to="/"
      class="text-sky-500 hover:text-sky-300 flex flex-row items-center space-x-2 group"
    >
      <HeroiconsOutlineChevronLeft class="group-hover:animate-ping" />
      <span>К списку комнат</span>
    </RouterLink>

    <span class="text-sm text-zinc-500 mt-10">Комната {{ roomStatus }}</span>
    <h2 class="text-3xl mb-10">{{ roomState.name }}</h2>

    <div class="flex flex-row space-x-3">
      <GButton
        class="w-full"
        @click="
          () => (roomState.stage === 'voting' ? stopVoting() : startVoting())
        "
        :variant="roomState.stage === 'voting' ? 'warning' : 'primary'"
      >
        {{ roomState.stage === 'voting' ? 'Завершить' : 'Начать' }}
        голосование
      </GButton>

      <GButton circle variant="error" class="flex-shrink-0" @click="deleteRoom"
        ><template #icon><HeroiconsOutlineTrash /></template
      ></GButton>
    </div>

    <p class="text-zinc-500 pt-8" v-if="roomState.stage === 'idle'">
      Начните первое голосование в этой комнате, нажав на кнопку выше
    </p>

    <p class="text-zinc-500 pt-8" v-if="roomState.stage === 'voting'">
      Подождите, пока все проголосуют, и нажмите кнопку снова
    </p>

    <p class="text-zinc-500 pt-8" v-if="roomState.stage === 'finished'">
      Вы можете начать следующее голосование
    </p>

    <div
      class="grid grid-cols-4 gap-3 mt-16"
      :class="selectedVote && 'pointer-events-none'"
      v-if="roomState.stage === 'voting'"
    >
      <GVotingCard
        v-for="i in POSSIBLE_VOTES"
        :key="i"
        :value="i"
        :is-selected="selectedVote === i"
        @click="vote(i)"
      />
    </div>

    <div class="mt-16 w-full h-64" v-else-if="roomState.stage === 'finished'">
      <table
        class="room-chart charts-css column show-labels show-4-secondary-axes"
      >
        <caption>
          Результаты
        </caption>

        <tbody>
          <tr v-for="[key, value] in Object.entries(votes)" :key="key">
            <th scope="row">{{ key }}</th>
            <td :style="`--size: calc(${value} / ${resultsSum})`">
              <span class="data">{{ value }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-else>Загрузка...</div>
</template>

<script setup lang="ts">
  import HeroiconsOutlineChevronLeft from '~icons/heroicons-outline/chevron-left'
  import HeroiconsOutlineTrash from '~icons/heroicons-outline/trash'
  import { useAsyncData, useHead, useRoute, useRouter } from '#app'
  import {
    computed,
    onMounted,
    onUnmounted,
    Ref,
    ref,
    watch,
    WatchStopHandle,
  } from 'vue'
  import { Room, POSSIBLE_VOTES, Vote } from '~/shared/domain'
  import GButton from '~/components/g-button.vue'
  import GVotingCard from '~/components/g-voting-card.vue'

  const route = useRoute()
  const router = useRouter()

  const id = computed(() => route.params.id as string)

  const asyncDataResult = await useAsyncData(
    `roomState${id.value}`,
    async () => {
      try {
        const result = await $fetch(`/api/rooms/get-state`, {
          params: {
            id: id.value,
          },
        })
        return <Room>result
      } catch (e) {
        router.push('/')
      }
    },
  )

  // неправильно подтягивает тип
  const roomState = asyncDataResult.data as Ref<Room>
  const reloadRoomState = asyncDataResult.refresh

  useHead({
    title: `${roomState.value?.name} | Poky`,
  })

  const selectedVote = ref<Vote>(null)

  const roomStatus = computed(() => {
    if (roomState.value.stage === 'idle') return 'в ожидании'
    if (roomState.value.stage === 'voting')
      return `голосует (${roomState.value.playersVoted} проголосовали)`
    if (roomState.value.stage === 'finished') return 'завершила голосование'
  })

  const stage = computed(() => roomState.value.stage)

  const votes = computed(
    () => roomState.value.stage === 'finished' && roomState.value.votes,
  )

  const resultsSum = computed(
    () => votes.value && Object.values(votes.value).reduce((a, b) => a + b),
  )

  const startVoting = async () => {
    const state = await $fetch(`/api/rooms/start-voting`, {
      params: {
        id: id.value,
      },
    })

    roomState.value = <Room>state
  }

  const stopVoting = async () => {
    const state = await $fetch(`/api/rooms/stop-voting`, {
      params: {
        id: id.value,
      },
    })

    roomState.value = <Room>state
  }

  const deleteRoom = async () => {
    await $fetch('/api/rooms/delete', {
      params: {
        id: id.value,
      },
    })

    router.push('/')
  }

  const vote = async (i: Vote) => {
    selectedVote.value = i

    if (roomState.value.stage === 'voting') {
      const state = await $fetch(`/api/rooms/vote`, {
        method: 'POST',
        body: {
          id: id.value,
          vote: i,
        },
      })

      roomState.value = state
    }
  }

  let intervalId: NodeJS.Timeout = null
  let stopWatch: WatchStopHandle

  onMounted(() => {
    intervalId = setInterval(reloadRoomState, 1000)

    stopWatch = watch(
      () => roomState.value?.stage,
      stage => {
        if (stage === 'finished') {
          selectedVote.value = null
        }
      },
    )
  })

  onUnmounted(() => {
    clearInterval(intervalId)

    stopWatch()
  })
</script>
