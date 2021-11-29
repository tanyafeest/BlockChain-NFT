import Connector from '@vue-polkadot/vue-api'

export function getInstanceDeposit(): bigint {
  const { api } = Connector.getInstance()
  return api.consts?.uniques?.instanceDeposit?.toBigInt()
}

export function getMetadataDeposit(): bigint {
  const { api } = Connector.getInstance()
  return api.consts?.uniques?.instanceDeposit?.toBigInt()
}

export function getDepositPerByte(): bigint {
  const { api } = Connector.getInstance()
  return api.consts?.uniques?.instanceDeposit?.toBigInt()
}

export function getclassDeposit(): bigint {
  const { api } = Connector.getInstance()
  return api.consts?.uniques?.classDeposit?.toBigInt()
}
