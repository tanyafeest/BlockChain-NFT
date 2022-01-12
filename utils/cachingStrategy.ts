// TODO: hacky, but works for now
import { getMany, setMany } from 'idb-keyval'

import { queryBatch } from '@/utils/cloudflare'
import { zip } from '~/components/rmrk/utils'
import { imageStore } from './idbStore'
import { fastExtract } from './ipfs'

type Option<T> = T | undefined
type MayString = Option<string>
type ZipResult = [string, string]
type P<T> = Promise<T>
type KeyValue = Record<string, string>

const DELIVERY_URL = 'https://imagedelivery.net/jk5b6spi_m_-9qC4VTnjpg/'


const urlOf = (ipfsHash: string) => DELIVERY_URL + ipfsHash + '/public'
const withUrlOf = ([key, value]: ZipResult) => [key, urlOf(value)]

export const getImageLinks = async (keys: string[]): P<KeyValue>  => {
  const values = keys.map(fastExtract).filter(Boolean)
  const cached = await getMany<string>(values, imageStore)
  const zipped = zip<string, MayString, ZipResult>(keys, cached)
  const uncached = zipped.filter(([, value]) => !value).map(([key]) => key)
  const deliveryLinks: KeyValue = await queryBatch(uncached).then(values => Object.entries(values).map(withUrlOf)).then(Object.fromEntries)
  setMany(Object.entries(deliveryLinks), imageStore).catch(console.warn)
  return {
    // ...Object.fromEntries(zipped.map()),
    ...deliveryLinks,
  }
}


