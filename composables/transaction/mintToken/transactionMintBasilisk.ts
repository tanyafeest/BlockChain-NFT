import type { ActionMintToken, MintedCollectionBasilisk } from '../types'
import { isRoyaltyValid } from '@/utils/royalty'
import { constructMeta } from './constructMeta'
import { ExecuteTransactionParams } from '@/composables/useTransaction'

export async function execMintBasilisk(
  item: ActionMintToken,
  api,
  executeTransaction: (p: ExecuteTransactionParams) => void
) {
  const { $i18n } = useNuxtApp()

  const {
    id: collectionId,
    alreadyMinted: collectionAlreadyMinted,
    lastIndexUsed,
  } = item.token.selectedCollection as MintedCollectionBasilisk
  const { price, royalty, hasRoyalty } = item.token

  const metadata = await constructMeta(item)

  const cb = api.tx.utility.batchAll

  const nextId = Math.max(lastIndexUsed + 1, collectionAlreadyMinted + 1)

  const create = api.tx.nft.mint(collectionId, nextId, metadata)

  const list = price
    ? [api.tx.marketplace.setPrice(collectionId, nextId, price)]
    : []

  const addRoyalty =
    royalty !== undefined && isRoyaltyValid(royalty) && hasRoyalty
      ? [
          api.tx.marketplace.addRoyalty(
            collectionId,
            nextId,
            royalty.address,
            royalty.amount * 100
          ),
        ]
      : []

  const args = [[create, ...list, ...addRoyalty]]

  executeTransaction({
    cb,
    arg: args,
    successMessage:
      item.successMessage ||
      ((blockNumber) =>
        $i18n.t('mintNFTSuccess', {
          name: item.token.name,
          block: blockNumber,
        })),
    errorMessage:
      item.errorMessage || $i18n.t('mint.ErrorCreateNewNft', item.token.name),
  })
}
