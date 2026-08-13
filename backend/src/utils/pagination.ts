export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit) || 1
  const skip = (page - 1) * limit
  return { data, total, page, limit, totalPages, skip }
}
