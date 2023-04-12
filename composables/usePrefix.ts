import { DEFAULT_PREFIX } from '@kodadot1/static'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import type { Prefix } from '@kodadot1/static'

export default function () {
  const { $store } = useNuxtApp()
  const route = useRoute()
  const storage = useLocalStorage('urlPrefix', { selected: DEFAULT_PREFIX })

  const prefix = ref(
    route.params.prefix ||
      route.path.split('/')[1] ||
      storage.value.selected ||
      $store.getters.currentUrlPrefix
  )
  const urlPrefix = computed<Prefix>(() => {
    storage.value = { selected: prefix.value }
    return prefix.value
  })

  const client = computed<string>(() => {
    return urlPrefix.value === 'rmrk' ? 'subsquid' : urlPrefix.value
  })

  const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))

  const assets = (id: string | number) => {
    return $store.getters['assets/getAssetById'](id)
  }

  return {
    urlPrefix,
    client,
    tokenId,
    assets,
  }
}
