import i18n from '@/i18n'
import { Column, RowSeries, SimpleSeriesNFT } from './types'
import formatBalance from '@/utils/formatBalance'
import store from '@/store'
import { getVolume, pairListBuyEvent } from '@/utils/math'
import { Interaction } from '../rmrk/service/scheme'
import { isAfter, isEqual, subDays, parseISO } from 'date-fns'

export const columns: Column[] = [
  { field: 'id', label: i18n.t('spotlight.id') },
  { field: 'rank', label: i18n.t('spotlight.score'), numeric: true },
  { field: 'unique', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'averagePrice', label: 'Floor price', numeric: true },
  { field: 'sold', label: i18n.t('spotlight.sold'), numeric: true },
  { field: 'uniqueCollectors', label: i18n.t('spotlight.unique'), numeric: true },
  { field: 'total', label: i18n.t('spotlight.total'), numeric: true }
]

export const nftFn = (a: any): RowSeries => {
  // const metaImage = fetchMetadataImage(a); DO NOT!
  const total = a.nfts.totalCount
  const collectionNfts = a.nfts.nodes
  const sold = a.nfts.nodes.reduce(soldFn, 0)
  const unique = a.nfts.nodes.reduce(uniqueFn, new Set()).size
  const averagePrice = a.nfts.nodes.filter(onlyOwned).reduce(sumFn, 0) / (a.nfts.nodes.length || 1)
  const uniqueCollectors = [...new Set(a.nfts.nodes.map((nft: SimpleSeriesNFT) => nft.currentOwner))].length
  const floorPrice = Math.min(
    ...collectionNfts.map((nft: SimpleSeriesNFT) => Number(nft.price)).filter((price: number) => price > 0)
  )

  // console.log(buyEvents)

  // const volume = 0
  const weeklyVolume = 0
  const monthlyVolume = 0

  const buyEvents = collectionNfts.map(onlyEvents).map(pairListBuyEvent).flat()
  const volume =  Number(getVolume(buyEvents))
  // const weeklyVolume = getVolume(buyEvents.filter(after(lastweekDate)))
  // const monthlyVolume = getVolume(buyEvents.filter(after(lastmonthDate)))


  return {
    id: a.id,
    name: a.name,
    image: '', // NOPE
    metadata: a.metadata,
    volume,
    total,
    sold,
    unique,
    uniqueCollectors,
    averagePrice,
    floorPrice,
    weeklyVolume,
    monthlyVolume,
    rank: sold * (unique / total)
  }
}

const formatNumber = (val: SimpleSeriesNFT) =>
  Number(
    formatBalance(
      val.price,
      store.getters.getChainProperties.tokenDecimals,
      false,
      true
    )
  )
const sumFn = (acc: number, val: SimpleSeriesNFT) => acc + formatNumber(val)
const soldFn = (acc: number, val: SimpleSeriesNFT) => val.issuer !== val.currentOwner ? acc + 1 : acc
const uniqueFn = (acc: Set<string>, val: SimpleSeriesNFT) => acc.add(val.metadata)
const onlyOwned = ({ issuer, currentOwner }: SimpleSeriesNFT) => issuer === currentOwner
// const onlyBuyEvents = ({ events }: SimpleSeriesNFT) => events.filter((e: { interaction: string }) => e.interaction === 'BUY')
// const onlyListEvents = (e: { interaction: string }) => e.interaction === 'LIST'
// const reducer = (a: number, b: number): number => Number(a) + Number(b)
const onlyEvents = (nft: SimpleSeriesNFT) => nft.events

const after = (date: Date) => (event: Interaction) => isAfter(parseISO(event.timestamp), date) || isEqual(parseISO(event.timestamp), date)
const lastweekDate: Date = subDays(new Date(), 7)
const lastmonthDate: Date = subDays(new Date(), 30)
