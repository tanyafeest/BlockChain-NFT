type Args = { resetPage?: boolean }
export default function ({ resetPage }: Args = { resetPage: true }) {
  const { $consola } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()
  const replaceUrl = (queryCondition: {
    [key: string]: string | null | boolean | undefined | number
  }) => {
    const query = {
      ...route.query,
      ...replaceBooleanWithStrings(queryCondition),
    }
    if (resetPage) {
      query.page = '1'
    }
    router
      .replace({
        path: String(route.path),
        query,
      })
      .catch($consola.warn)
  }

  return {
    replaceUrl,
  }
}

function replaceBooleanWithStrings(
  obj: Record<string, string | null | boolean | undefined | number>
): Record<string, string | null | undefined> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key] =
      typeof value === 'boolean' || typeof value === 'number'
        ? String(value)
        : value
    return result
  }, {})
}
