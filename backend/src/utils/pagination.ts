export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit) || 1
  return { data, total, page, limit, totalPages }
}
