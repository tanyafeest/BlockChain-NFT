import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import {
  calculateAvgPrice,
  monthlyVolume,
  monthlyrangeVolume,
  threeMonthRangeVolume,
  threeMonthlyVolume,
  volume,
  weeklyVolume,
  weeklyrangeVolume,
} from '@/components/series/utils'
import {
  CollectionEntity,
  CollectionEntityWithVolumes,
  CollectionSales,
} from './types'
import { useTopCollectionList } from './useTopCollectionList'
import { useCollectionsSales } from './useCollectionsSales'

const topCollectionWithVolumeList = ref<CollectionEntityWithVolumes[]>([])
const topCollectionList = ref<CollectionEntity[] | null>(null)
const collectionSalesList = ref<CollectionSales[] | null>(null)

const fetchError = ref(null)
const isLoading = ref(true)

const proccessData = (
  collectionEntities: CollectionEntity[],
  collectionsSales: CollectionSales[]
) => {
  return collectionEntities.map((e): CollectionEntityWithVolumes => {
    const thisCollectionSales = collectionsSales.find(
      ({ id }) => id === e.id
    ) as CollectionSales
    const saleEvents = thisCollectionSales.sales.map((nft) => nft.events).flat()

    return {
      ...e,
      image: sanitizeIpfsUrl(e.image),
      averagePrice: calculateAvgPrice(e.volume as string, e.buys),
      volume: volume(saleEvents),
      weeklyVolume: weeklyVolume(saleEvents),
      monthlyVolume: monthlyVolume(saleEvents),
      threeMonthVolume: threeMonthlyVolume(saleEvents),
      weeklyrangeVolume: weeklyrangeVolume(saleEvents),
      monthlyrangeVolume: monthlyrangeVolume(saleEvents),
      threeMonthlyrangeVolume: threeMonthRangeVolume(saleEvents),
    }
  })
}

// when topCollectionList is ready, fetch collections Sales
watch(topCollectionList, (topCollectionList) => {
  if (topCollectionList) {
    const collectionIds = (
      topCollectionList as unknown as CollectionEntity[]
    ).map((c) => c.id)
    const { data: collectionSales, error } = useCollectionsSales(collectionIds)

    watch([collectionSales, error], ([collectionSales, error]) => {
      if (error) {
        fetchError.value = error
        isLoading.value = false
        return
      }

      // trigger the next watcher, that will proccess
      // topCollectionList and collectionSalesList
      collectionSalesList.value = collectionSales
    })
  }
})

// when both topCollectionList and collectionSalesList are ready
// merge them together based on collection id
// and set the value of topCollectionWithVolumeList
watch(
  [topCollectionList, collectionSalesList],
  ([topCollectionList, collectionSalesList]) => {
    if (topCollectionList && collectionSalesList) {
      topCollectionWithVolumeList.value = proccessData(
        topCollectionList,
        collectionSalesList
      )
      isLoading.value = false
    }
  }
)

export const useTopCollections = (limit: number) => {
  //start
  const { data, error: error1 } = useTopCollectionList(limit)
  watch([data, error1], ([data, error]) => {
    if (error) {
      fetchError.value = error
      isLoading.value = false
      return
    }
    // trigger watcher, that will continue to next fetch (collection sales)
    topCollectionList.value = data
  })

  return {
    data: topCollectionWithVolumeList,
    error: fetchError,
    loading: isLoading,
  }
}
