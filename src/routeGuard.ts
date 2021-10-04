import Connector from '@vue-polkadot/vue-api'
import { NotificationProgrammatic as Notification } from 'buefy'

export const apiEnabled = (next: Function): boolean => {
  if (Connector.getInstance().api) {
    next()
    return true
  } else {
    next({ name: 'landing' })
    Notification.open({
      duration: 7000,
      message: 'API is not connected yet. <br> Please try later.',
      queue: false,
      type: 'is-danger',
      position: 'is-top-right',
    })
    return false
  }
}
