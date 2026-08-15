<template>
  <!-- Client messages page reuses the same layout as freelancer -->
  <q-page class="messages-page">
    <div class="messages-layout">
      <div class="conversations-panel" :class="{ 'panel-hidden': activeConv && $q.screen.lt.md }">
        <div class="conv-header q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Messages</div>
          <q-input v-model="convSearch" dense outlined placeholder="Search..." rounded>
            <template #prepend><q-icon name="search" size="16px" /></template>
          </q-input>
        </div>
        <q-scroll-area class="conv-list">
          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            class="conv-item"
            :class="{ active: activeConv?.id === conv.id }"
            @click="openConversation(conv)"
          >
            <q-avatar size="44px" color="accent" text-color="white">
              <span>{{ getInitials(getOther(conv)?.fullName || '') }}</span>
            </q-avatar>
            <div class="col q-ml-sm conv-info">
              <div class="row items-center justify-between">
                <span class="conv-name">{{ getOther(conv)?.fullName }}</span>
                <span class="conv-time text-xs text-grey-5">{{ conv.lastMessage ? timeAgo(conv.lastMessage.createdAt) : '' }}</span>
              </div>
              <div class="conv-last-msg">{{ conv.lastMessage?.content || 'No messages yet' }}</div>
            </div>
            <div v-if="conv.unreadCount" class="conv-unread-badge">{{ conv.unreadCount }}</div>
          </div>
          <div v-if="!chatStore.conversations.length" class="text-center q-pa-xl text-grey-5">
            <q-icon name="chat_bubble_outline" size="48px" /><div class="q-mt-sm">No conversations yet</div>
          </div>
        </q-scroll-area>
      </div>

      <div class="chat-area" :class="{ 'panel-visible': activeConv && $q.screen.lt.md }">
        <template v-if="activeConv">
          <div class="chat-header q-pa-md row items-center q-gutter-sm">
            <q-btn flat round dense icon="arrow_back" class="lt-md" @click="activeConv = null" />
            <q-avatar size="36px" color="accent" text-color="white"><span class="text-caption">{{ getInitials(getOther(activeConv)?.fullName || '') }}</span></q-avatar>
            <div class="text-weight-bold">{{ getOther(activeConv)?.fullName }}</div>
          </div>
          <q-separator />
          <ChatWindow class="chat-window-inner" />
        </template>
        <div v-else class="chat-empty text-center text-grey-5">
          <q-icon name="forum" size="72px" class="q-mb-md" />
          <h3>Select a conversation</h3>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useQuasar } from 'quasar'
  import { useChatStore } from 'src/stores/chat.store'
  import { useAuthStore } from 'src/stores/auth.store'
  import { getInitials, timeAgo } from 'src/utils/helpers'
  import type { Conversation, User } from 'src/types'
  import ChatWindow from 'src/components/common/ChatWindow.vue'

  const $q = useQuasar()
  const chatStore = useChatStore()
  const authStore = useAuthStore()
  const convSearch = ref('')
  const activeConv = ref<Conversation | null>(null)

  const filteredConversations = computed(() =>
    chatStore.sortedConversations.filter(c => !convSearch.value || getOther(c)?.fullName?.toLowerCase().includes(convSearch.value.toLowerCase()))
  )

  function getOther(conv: Conversation): User | undefined {
    return conv.participants.find(p => p.id !== authStore.user?.id)
  }

  async function openConversation(conv: Conversation) {
    activeConv.value = conv
    chatStore.activeConversation = conv
    await chatStore.loadMessages(conv.id)
    chatStore.markAsRead(conv.id)
  }

  onMounted(() => chatStore.fetchConversations())
</script>