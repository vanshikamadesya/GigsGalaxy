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

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .drawer-item {
    border-radius: $radius-md;
    margin: 2px 8px;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-secondary;
    transition: all $transition-fast;

    &:hover {
      background: rgba(91, 33, 182, 0.06);
      color: $primary;
    }

    .body--dark & {
      color: rgba(255,255,255,0.7);
      &:hover { background: rgba(139, 92, 246, 0.12); color: $secondary; }
    }
  }

  .drawer-item-active {
    background: rgba(91, 33, 182, 0.1) !important;
    color: $primary !important;
    font-weight: 600 !important;

    .q-icon { color: $primary !important; }

    .body--dark & {
      background: rgba(139, 92, 246, 0.18) !important;
      color: $secondary !important;
      .q-icon { color: $secondary !important; }
    }
  }

  .admin-item.drawer-item-active {
    background: rgba(245, 158, 11, 0.12) !important;
    color: #f59e0b !important;
    .q-icon { color: #f59e0b !important; }
  }
</style>
