import { ref, reactive } from 'vue'
import type { ObjectSchema } from 'yup'

export function useForm<T extends object>(
  initialValues: T,
  schema?: ObjectSchema<T>
) {
  const form = reactive<T>({ ...initialValues }) as T
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const loading = ref(false)
  const isDirty = ref(false)

  function setField<K extends keyof T>(key: K, value: T[K]) {
    (form as Record<keyof T, unknown>)[key] = value
    isDirty.value = true
    // Clear error on change
    if (errors[key]) delete errors[key]
  }

  async function validate(): Promise<boolean> {
    if (!schema) return true
    try {
      await schema.validate(form, { abortEarly: false })
      // Clear all errors
      Object.keys(errors).forEach(k => delete (errors as Record<string, unknown>)[k])
      return true
    } catch (err: unknown) {
      const yupErr = err as { inner?: Array<{ path: string; message: string }> }
      if (yupErr.inner) {
        yupErr.inner.forEach(e => {
          if (e.path) {
            (errors as Record<string, string>)[e.path] = e.message
          }
        })
      }
      return false
    }
  }

  async function handleSubmit(callback: (values: T) => Promise<void>) {
    const valid = await validate()
    if (!valid) return
    loading.value = true
    try {
      await callback({ ...form })
      isDirty.value = false
    } finally {
      loading.value = false
    }
  }

  function reset() {
    Object.assign(form as object, initialValues)
    Object.keys(errors).forEach(k => delete (errors as Record<string, unknown>)[k])
    isDirty.value = false
  }

  return {
    form,
    errors,
    loading,
    isDirty,
    setField,
    validate,
    handleSubmit,
    reset
  }
}
