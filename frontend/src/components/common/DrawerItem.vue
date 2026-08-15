<template>
  <q-item
    clickable
    v-ripple
    :to="item.to || undefined"
    :active="isActive"
    active-class="drawer-item-active"
    class="drawer-item"
    :class="{ 'admin-item': admin, 'justify-center': mini }"
    @click="item.action && item.action()"
  >
    <q-item-section avatar>
      <q-icon :name="item.icon" :size="mini ? '22px' : '20px'" />
    </q-item-section>
    <q-item-section v-if="!mini">
      {{ item.label }}
    </q-item-section>
    <q-item-section v-if="!mini && item.badge" side>
      <q-badge :color="item.badgeColor || 'primary'" :label="item.badge" />
    </q-item-section>
    <q-tooltip v-if="mini" anchor="center right" self="center left" :offset="[14, 0]">
      {{ item.label }}
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  interface NavItem {
    icon: string
    label: string
    to: string
    action?: () => void
    badge?: string | number
    badgeColor?: string
  }

  const props = defineProps<{
    item: NavItem
    mini?: boolean
    admin?: boolean
  }>()

  const route = useRoute()
  const isActive = computed(() =>
    props.item.to ? route.path === props.item.to || route.path.startsWith(props.item.to + '/') : false
  )
</script>