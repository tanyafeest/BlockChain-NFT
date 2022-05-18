import formatBalance from '@/utils/formatBalance'

export const enum HistoryEventType {
  MINTNFT = 'MINTNFT',
  LIST = 'LIST',
  BUY = 'BUY',
  SEND = 'SEND',
  CONSUME = 'CONSUME',
  UNLIST = 'UNLIST',
  ALL = 'ALL',
}

export const eventToIconMap = {
  [HistoryEventType.MINTNFT]: '🖼',
  [HistoryEventType.LIST]: '📰',
  [HistoryEventType.UNLIST]: '🗞',
  [HistoryEventType.SEND]: '🎁',
  [HistoryEventType.CONSUME]: '🔥',
  [HistoryEventType.BUY]: '🤝',
}

export const wrapEventNameWithIcon = (
  type: HistoryEventType,
  eventName: string
) => `${eventToIconMap[type]} ${eventName}`

export const parseDate = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export const parseAmount = (
  amount: string,
  decimals: number,
  unit: string
): string => {
  return parseInt(amount) ? formatBalance(amount, decimals, unit) : '-'
}
