import { ExecuteTransactionParams } from '../useTransaction'
import { execMintRmrk } from './MintToken/transactionMinRmrk'
import { execMintBasilisk } from './MintToken/transactionMintBasilisk'
import { ActionMintToken } from './types'

export async function execMintToken(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'rmrk2') {
    execMintRmrk(item, api, executeTransaction)
  }

  if (item.urlPrefix === 'snek' || item.urlPrefix === 'bsx') {
    execMintBasilisk(item, api, executeTransaction)
  }
}
