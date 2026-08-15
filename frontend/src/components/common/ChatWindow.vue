<template>
  <div class="chat-window">
    <!-- Messages area -->
    <q-scroll-area ref="scrollRef" class="chat-messages" @scroll="onScroll">
      <div class="q-pa-md">
        <!-- Load more -->
        <div v-if="!chatStore.loading" class="text-center q-mb-md">
          <q-btn flat dense no-caps size="sm" label="Load older messages" @click="loadOlder" />
        </div>

        <!-- Messages -->
        <template v-for="(msg, idx) in chatStore.messages" :key="msg.id">
          <!-- Date separator -->
          <div v-if="showDateSeparator(idx)" class="date-separator">
            <span>{{ formatDate(msg.createdAt, 'MMM DD, YYYY') }}</span>
          </div>

          <!-- Message bubble -->
          <div
            class="msg-row"
            :class="msg.senderId === authStore.user?.id ? 'msg-own' : 'msg-other'"
          >
            <q-avatar v-if="msg.senderId !== authStore.user?.id" size="28px" color="primary" text-color="white" class="msg-avatar">
              <img v-if="msg.sender?.avatar" :src="msg.sender.avatar" />
              <span v-else class="text-caption">{{ getInitials(msg.sender?.fullName || '') }}</span>
            </q-avatar>

            <div class="msg-content">
              <!-- File message -->
              <template v-if="msg.type === 'file' || msg.type === 'image'">
                <q-img v-if="msg.type === 'image'" :src="msg.fileUrl" style="max-width:240px;border-radius:12px" />
                <q-card v-else flat bordered class="file-msg-card">
                  <q-card-section horizontal class="items-center q-pa-sm q-gutter-sm">
                    <q-icon name="attach_file" color="primary" />
                    <div>
                      <div class="text-sm font-medium">{{ msg.fileName }}</div>
                      <div class="text-xs text-grey">{{ msg.fileSize ? formatFileSize(msg.fileSize) : '' }}</div>
                    </div>
                    <q-btn flat round dense icon="download" size="sm" :href="msg.fileUrl" target="_blank" />
                  </q-card-section>
                </q-card>
              </template>

              <!-- Text message -->
              <div v-else class="msg-bubble" :class="msg.senderId === authStore.user?.id ? 'bubble-own' : 'bubble-other'">
                {{ msg.content }}
              </div>

              <div class="msg-meta">{{ formatDate(msg.createdAt, 'HH:mm') }}</div>
            </div>
          </div>
        </template>

        <!-- Typing indicator -->
        <div v-if="someoneTyping" class="msg-row msg-other">
          <div class="msg-bubble bubble-other typing-indicator">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </q-scroll-area>

    <!-- Input area -->
    <div class="chat-input-area q-pa-sm">
      <div class="row items-end q-gutter-sm">
        <!-- File attach -->
        <q-btn flat round icon="attach_file" size="sm" @click="fileInput?.click()" />
        <input ref="fileInput" type="file" style="display:none" @change="handleFile" />

        <!-- Emoji -->
        <q-btn flat round icon="tag_faces" size="sm">
          <q-tooltip>Emoji support coming soon</q-tooltip>
        </q-btn>

        <!-- Text input -->
        <q-input
          v-model="messageText"
          dense outlined autogrow
          placeholder="Type a message..."
          class="col chat-input"
          @keydown.enter.exact.prevent="sendMessage"
          @input="onTyping"
        />

        <!-- Send -->
        <q-btn
          unelevated round
          icon="send"
          color="primary"
          :disable="!messageText.trim()"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, onMounted, watch } from 'vue'
  import { useChatStore } from 'src/stores/chat.store'
  import { useAuthStore } from 'src/stores/auth.store'
  import { getInitials, formatDate, formatFileSize } from 'src/utils/helpers'
  import { emitTyping } from 'src/boot/socket'
  import type { QScrollArea } from 'quasar'

  const chatStore = useChatStore()
  const authStore = useAuthStore()

  const messageText = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)
  const scrollRef = ref<InstanceType<typeof QScrollArea> | null>(null)

  const someoneTyping = computed(() => chatStore.typingUsers.size > 0)

  function showDateSeparator(idx: number): boolean {
    if (idx === 0) return true
    const curr = chatStore.messages[idx]
    const prev = chatStore.messages[idx - 1]
    return formatDate(curr.createdAt, 'YYYY-MM-DD') !== formatDate(prev.createdAt, 'YYYY-MM-DD')
  }

  async function sendMessage() {
    if (!messageText.value.trim()) return
    const text = messageText.value
    messageText.value = ''
    await chatStore.sendMessage(text, 'text')
    scrollToBottom()
  }

  async function handleFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const type = file.type.startsWith('image/') ? 'image' : 'file'
    await chatStore.sendMessage(file.name, type, file)
    scrollToBottom()
  }

  let typingTimeout: ReturnType<typeof setTimeout>
  function onTyping() {
    if (!chatStore.activeConversation) return
    emitTyping(chatStore.activeConversation.id, true)
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      if (chatStore.activeConversation) emitTyping(chatStore.activeConversation.id, false)
    }, 2000)
  }

  function loadOlder() {
    if (chatStore.activeConversation) {
      chatStore.loadMessages(chatStore.activeConversation.id, 2)
    }
  }

  function onScroll() { /* infinite scroll upwards */ }

  function scrollToBottom() {
    nextTick(() => {
      scrollRef.value?.setScrollPercentage('vertical', 1, 200)
    })
  }

  onMounted(() => scrollToBottom())
  watch(() => chatStore.messages.length, () => scrollToBottom())
</script>