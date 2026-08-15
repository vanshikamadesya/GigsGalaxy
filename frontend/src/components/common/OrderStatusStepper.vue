<template>
  <q-stepper
    v-model="activeStep"
    flat
    bordered
    color="primary"
    class="order-stepper"
    alternative-labels
  >
    <q-step
      v-for="step in steps"
      :key="step.value"
      :name="step.value"
      :title="step.title"
      :icon="step.icon"
      :done="isStepDone(step.value)"
      :active-icon="step.icon"
      :done-color="step.doneColor || 'positive'"
      :active-color="isCancelled ? 'negative' : 'primary'"
      :header-nav="false"
    />
  </q-stepper>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { OrderStatus } from 'src/types'

  const props = defineProps<{ status: OrderStatus }>()

  const statusOrder: OrderStatus[] = ['pending', 'accepted', 'in_progress', 'delivered', 'completed']

  const isCancelled = computed(() => props.status === 'cancelled')

  const activeStep = computed(() => isCancelled.value ? 'cancelled' : props.status)

  const steps = [
    { value: 'pending',     title: 'Pending',     icon: 'hourglass_empty', doneColor: 'primary' },
    { value: 'accepted',    title: 'Accepted',    icon: 'check_circle',    doneColor: 'primary' },
    { value: 'in_progress', title: 'In Progress', icon: 'work',            doneColor: 'primary' },
    { value: 'delivered',   title: 'Delivered',   icon: 'inventory',       doneColor: 'primary' },
    { value: 'completed',   title: 'Completed',   icon: 'verified',        doneColor: 'positive' }
  ]

  function isStepDone(stepValue: string) {
    const idx = statusOrder.indexOf(stepValue as OrderStatus)
    const currentIdx = statusOrder.indexOf(props.status)
    return idx < currentIdx
  }
</script>