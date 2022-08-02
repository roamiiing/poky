<template>
  <div class="relative">
    <input
      class="peer w-full appearance-none rounded-lg border border-zinc-100 bg-zinc-50 px-5 transition-colors duration-100 placeholder:opacity-0 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:focus:bg-zinc-600"
      :id="id"
      :placeholder="label || 'Input'"
      :value="modelValue"
      @input="onInput"
      :class="{
        'pt-4 pb-2': !!label,
        'py-3': !label,
      }"
    />
    <label
      v-if="label"
      class="pointer-events-none absolute top-1 left-5 select-none text-xs text-zinc-400 transition-all duration-100 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs"
      :for="id"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label?: string
    modelValue?: string
    id?: string
  }>()
  const emit = defineEmits<{
    (name: 'update:modelValue', newValue: string): void
  }>()
  const onInput = (event: Event) =>
    emit('update:modelValue', (event.target as HTMLInputElement)?.value)
</script>
