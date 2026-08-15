<template>
  <q-page class="messages-page">
    <div class="messages-layout">
      <!-- Conversations sidebar -->
      <div class="conversations-panel" :class="{ 'panel-hidden': activeConv && $q.screen.lt.md }">
        <div class="conv-header q-pa-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Messages</div>
          <q-input v-model="convSearch" dense outlined placeholder="Search conversations..." rounded>
            <template #prepend><q-icon name="search" size="16px" /></template>
          </q-input>
        </div>

        <q-scroll-area class="conv-list">
          <div v-if="chatStore.loading" class="q-pa-md">
            <div v-for="i in 5" :key="i" class="conv-skeleton q-mb-sm">
              <div class="skeleton" style="width:40px;height:40px;border-radius:50%;flex-shrink:0" />
              <div class="col q-ml-sm">
                <div class="skeleton q-mb-xs" style="height:13px;width:80%" />
                <div class="skeleton" style="height:11px;width:60%" />
              </div>
            </div>
          </div>

          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            class="conv-item"
            :class="{ active: activeConv?.id === conv.id }"
            @click="openConversation(conv)"
          >
            <div class="conv-avatar-wrap">
              <q-avatar size="44px" color="primary" text-color="white">
                <span>{{ getInitials(getOtherParticipant(conv)?.fullName || '') }}</span>
              </q-avatar>
              <div v-if="chatStore.onlineUsers.has(getOtherParticipant(conv)?.id || '')" class="conv-online-dot" />
            </div>
            <div class="col conv-info">
              <div class="row items-center justify-between">
                <span class="conv-name">{{ getOtherParticipant(conv)?.fullName }}</span>
                <span class="conv-time text-xs text-grey-5">{{ conv.lastMessage ? timeAgo(conv.lastMessage.createdAt) : '' }}</span>
              </div>
              <div class="conv-last-msg">{{ conv.lastMessage?.content || 'No messages yet' }}</div>
            </div>
            <div v-if="conv.unreadCount" class="conv-unread-badge">{{ conv.unreadCount }}</div>
          </div>

          <div v-if="!chatStore.loading && !chatStore.conversations.length" class="text-center q-pa-xl text-grey-5">
            <q-icon name="chat_bubble_outline" size="48px" class="q-mb-md" />
            <div>No conversations yet</div>
          </div>
        </q-scroll-area>
      </div>

      <!-- Chat area -->
      <div class="chat-area" :class="{ 'panel-visible': activeConv && $q.screen.lt.md }">
        <template v-if="activeConv">
          <!-- Chat header -->
          <div class="chat-header q-pa-md row items-center q-gutter-sm">
            <q-btn flat round dense icon="arrow_back" class="lt-md" @click="activeConv = null" />
            <q-avatar size="36px" color="primary" text-color="white">
              <span class="text-caption">{{ getInitials(getOtherParticipant(activeConv)?.fullName || '') }}</span>
            </q-avatar>
            <div>
              <div class="text-weight-bold">{{ getOtherParticipant(activeConv)?.fullName }}</div>
              <div class="text-xs" :class="chatStore.onlineUsers.has(getOtherParticipant(activeConv)?.id || '') ? 'text-positive' : 'text-grey-5'">
                {{ chatStore.onlineUsers.has(getOtherParticipant(activeConv)?.id || '') ? 'Online' : 'Offline' }}
              </div>
            </div>
          </div>
          <q-separator />
          <ChatWindow class="chat-window-inner" />
        </template>

        <div v-else class="chat-empty text-center text-grey-5">
          <q-icon name="forum" size="72px" class="q-mb-md" />
          <h3 class="q-mb-sm">Select a conversation</h3>
          <p>Choose a conversation from the left to start messaging</p>
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

  const filteredConversations = computed(() => {
    const q = convSearch.value.toLowerCase()
    return chatStore.sortedConversations.filter(c =>
      !q || getOtherParticipant(c)?.fullName?.toLowerCase().includes(q)
    )
  })

  function getOtherParticipant(conv: Conversation): User | undefined {
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