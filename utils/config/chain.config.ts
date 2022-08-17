import { ChainProperties } from '../api/Query'
import { Config, Prefix } from './types'

export const toChainProperty = (
  ss58Format: number,
  tokenDecimals: number,
  tokenSymbol: string,
  blockExplorer?: string
): ChainProperties => {
  return {
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    blockExplorer,
  }
}

const DEFAULT_CHAIN_PROPERTIES: ChainProperties = toChainProperty(
  2,
  12,
  'KSM',
  'https://kusama.subscan.io/'
)

const chainPropertyMap: Config<ChainProperties> = {
  rmrk: DEFAULT_CHAIN_PROPERTIES,
  bsx: toChainProperty(10041, 12, 'BSX', 'https://basilisk.subscan.io/'),
  statemine: DEFAULT_CHAIN_PROPERTIES,
  westmint: DEFAULT_CHAIN_PROPERTIES,
  moonsama: toChainProperty(1285, 12, 'MOVR', 'https://moonriver.subscan.io/'),
}

export const chainPropListOf = (prefix: Prefix | string): ChainProperties => {
  return chainPropertyMap[prefix]
}

export const ss58Of = (prefix: Prefix | string): number => {
  return chainPropListOf(prefix).ss58Format
}

export const blockExplorerOf = (
  prefix: Prefix | string
): string | undefined => {
  return chainPropListOf(prefix).blockExplorer
}
