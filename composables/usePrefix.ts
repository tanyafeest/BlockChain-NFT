import { getKusamaAssetId } from '@/utils/api/bsx/query'

export default function () {
  const { $store } = useNuxtApp()
  const route = useRoute()

  const prefix = ref(route.params.prefix || $store.getters.currentUrlPrefix)
  const urlPrefix = computed<string>(() => prefix.value || 'bsx')

  const client = computed<string>(() => {
    return urlPrefix.value === 'rmrk' ? 'subsquid' : urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    return $store.getters['assets/getAssetById'](id)
  }

  // we can remove this watcher
  // once we are not rely on `$store.getters.currentUrlPrefix`
  watch(
    () => route.params.prefix,
    (newPrefix) => {
      if (urlPrefix.value !== route.params.prefix && newPrefix) {
        prefix.value = newPrefix
        $store.dispatch('setUrlPrefix', newPrefix)
      }
    }
  )

  return {
    urlPrefix,
    client,
    tokenId,
    assets,
  }
}
