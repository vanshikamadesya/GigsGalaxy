import { useQuasar } from 'quasar'

export function useNotify() {
  const $q = useQuasar()

  const success = (message: string) => {
    $q.notify({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 3000,
      icon: 'check_circle'
    })
  }

  const error = (message: string) => {
    $q.notify({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 4000,
      icon: 'error'
    })
  }

  const warning = (message: string) => {
    $q.notify({
      type: 'warning',
      message,
      position: 'top-right',
      timeout: 3500,
      icon: 'warning'
    })
  }

  const info = (message: string) => {
    $q.notify({
      type: 'info',
      message,
      position: 'top-right',
      timeout: 3000,
      icon: 'info'
    })
  }

  const confirm = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    $q.dialog({
      title: 'Confirm Action',
      message,
      cancel: true,
      persistent: true,
      ok: { label: 'Confirm', color: 'primary', unelevated: true },
      cancel: { label: 'Cancel', flat: true }
    })
      .onOk(onConfirm)
      .onCancel(onCancel || (() => {}))
  }

  const confirmDelete = (itemName: string, onConfirm: () => void) => {
    $q.dialog({
      title: 'Delete Confirmation',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      cancel: true,
      persistent: true,
      ok: { label: 'Delete', color: 'negative', unelevated: true },
      cancel: { label: 'Cancel', flat: true }
    }).onOk(onConfirm)
  }

  return { success, error, warning, info, confirm, confirmDelete }
}
