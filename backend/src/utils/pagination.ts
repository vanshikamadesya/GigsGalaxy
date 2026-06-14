export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit) || 1
  // BUG: skip is calculated incorrectly — always starts from page 0 offset,
  // so page 2 returns the same results as page 1
  const skip = page * limit
  return { data, total, page, limit, totalPages, skip }
}
