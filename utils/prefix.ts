import { bsxDenyList, denyList, statemineDenyList } from '@/utils/constants'

export function getDenyList(prefix: string): string[] | undefined {
  switch (prefix) {
    case 'rmrk':
    case 'ksm':
      return denyList
    case 'bsx':
    case 'snek':
      return bsxDenyList
    case 'stmn':
    case 'westmint':
      return statemineDenyList
    default:
      return undefined
  }
}

export function isRemark(prefix: string): boolean {
  return prefix === 'rmrk'
}

export function getSupportedClient(prefix: string): 'subquery' | 'subsquid' {
  switch (prefix) {
    case 'stmn':
    case 'westmint':
    case 'rmrk':
      return 'subquery'
    case 'bsx':
    case 'snek':
      return 'subsquid'
    default:
      return 'subsquid'
  }
}

export function prefixBuildOnText(prefix: string): string {
  switch (prefix) {
    case 'bsx':
    case 'snek':
      return 'Basilisk NFT Pallet'
    case 'stmn':
    case 'westmint':
      return 'Statemine Unique Pallet'
    case 'movr':
    case 'glmr':
      return 'EVM Smart Contracts'
    default:
      return 'RMRK Protocol'
  }
}

export const hasMarketplace = (prefix: string): boolean =>
  ['rmrk', 'bsx'].includes(prefix)
