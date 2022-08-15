import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import logoNova from '@/assets/partners/logo-nova.png'

export class NovaWallet extends BaseDotsamaWallet {
  img = logoNova
  extensionName = 'nova'
  name = 'Nova'
  source = SupportWalletExtension.Nova
  walletUrl = 'https://novawallet.io/'
  guideUrl = 'https://novawallet.io/'
  isBrowserExtension = false
  isMobileApp = true
}
