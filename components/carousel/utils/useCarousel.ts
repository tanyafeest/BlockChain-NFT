import type { CarouselNFT } from '@/components/base/types'
import type { LastEvent } from '@/utils/types/types'
import type { RowSeries } from '@/components/series/types'

import { convertLastEventFlatNft } from '@/utils/carousel'
import { formatNFT } from '@/utils/carousel'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
import { visitedNFT } from '@/utils/localStorage'
import { sortItemListByIds } from '@/utils/sorting'

export const useCarouselUrl = () => {
  const { urlPrefix } = usePrefix()

  const profileUrl = computed(() => `${urlPrefix.value}-u-id`)

  const urlOf = ({ id, url }: { id: string; url: string }): string => {
    return `/${urlPrefix.value}/${url}/${id}`
  }

  return {
    profileUrl,
    urlOf,
  }
}

interface Types {
  type: 'latestSales' | 'newestList'
}

export const useCarouselNftEvents = ({ type }: Types) => {
  const variables = {
    latestSales: {
      limit: 10,
      event: 'BUY',
    },
    newestList: {
      limit: 10,
      event: 'LIST',
    },
  }
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'lastNftListByEvent',
    variables: variables[type],
  })

  const handleResult = async ({ data }: { data: { events: LastEvent[] } }) => {
    const events = data.events.map(convertLastEventFlatNft)
    nfts.value = await formatNFT(events)
  }
  const nfts = ref<CarouselNFT[]>([])

  watch(data, () => {
    if (data.value) {
      handleResult({ data: data.value })
    }
  })

  return {
    nfts,
  }
}

const popularCollectionsGraphql = {
  queryPrefix: 'subsquid',
  queryName: 'popularCollectionList',
  variables: {
    orderDirection: 'ASC',
    limit: 10,
    dateRange: '7 DAY',
    orderBy: 'volume',
  },
}
export const useCarouselPopularCollections = () => {
  const { data } = useGraphql(popularCollectionsGraphql)
  const nfts = ref<RowSeries[]>([])

  const handleResult = ({ data }) => {
    nfts.value = data.seriesInsightTable.map(
      (e: RowSeries): RowSeries => ({
        ...e,
        image: sanitizeIpfsUrl(e.image),
      })
    )
  }

  watch(data, () => {
    if (data.value) {
      handleResult({ data: data.value })
    }
  })

  return {
    nfts,
  }
}

interface Collections {
  collection: {
    id: string
    name: string
    nfts: CarouselNFT[]
  }
}

export const useCarouselRelated = ({ collectionId }) => {
  const { $route } = useNuxtApp()
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'collectionEntityById',
    variables: {
      id: collectionId,
      nftId: $route.params.id,
    },
  })
  const nfts = ref<CarouselNFT[]>([])

  watch(data, async () => {
    if (data.value) {
      nfts.value = await formatNFT((data.value as Collections).collection?.nfts)
    }
  })

  return {
    nfts,
  }
}

interface VisitedNFTs {
  nftEntities: CarouselNFT[]
}

export const useCarouselVisited = () => {
  const ids = visitedNFT().map((nft) => nft.id)
  const { data } = useGraphql({
    queryPrefix: 'subsquid',
    queryName: 'nftEntitiesByIDs',
    variables: {
      ids,
    },
  })
  const nfts = ref<CarouselNFT[]>([])

  watch(data, async () => {
    if (data.value) {
      const dataNfts = data.value as VisitedNFTs
      const filteredNftsNullMeta = dataNfts.nftEntities.filter(
        (nft) => nft.meta !== null
      )

      if (filteredNftsNullMeta) {
        const sortedNftList = sortItemListByIds(filteredNftsNullMeta, ids, 10)
        nfts.value = await formatNFT(sortedNftList)
      }
    }
  })

  return {
    nfts,
  }
}
