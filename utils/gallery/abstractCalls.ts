import type { ApiPromise } from '@polkadot/api'
type CallDictionary = Record<string, [string, string]>

export const uniqueActionResolver: CallDictionary = {
  SEND: ['uniques', 'transfer'],
  CONSUME: ['uniques', 'burn'],
  DELEGATE: ['uniques', 'approveTransfer'],
  FREEZE: ['uniques', 'freeze'],
  THAW: ['uniques', 'thaw'],
  REVOKE: ['uniques', 'cancelApproval'],
}

export const bsxActionResolver: CallDictionary = {
  SEND: ['nft', 'transfer'],
  CONSUME: ['nft', 'burn'],
  BUY: ['marketplace', 'buy'],
  LIST: ['marketplace', 'setPrice'],
}


export function getApiCall(api: ApiPromise, prefix: string, selectedAction: string) {
  const actionResolver = getActionsByPrefix(prefix)
  const [module, method] = actionResolver[selectedAction] || new Error('Action not found')
  return api.tx[module][method]
}


function getActionsByPrefix(prefix: string): CallDictionary {
  switch (prefix) {
    case 'statemine':
      return uniqueActionResolver
    case 'bsx':
      return bsxActionResolver
    default:
      throw new Error('Prefix not found')
  }
}

