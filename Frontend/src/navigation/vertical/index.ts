// ** Icon imports
import CartOutline from 'mdi-material-ui/CartOutline'
import Finance from 'mdi-material-ui/Finance'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import WindowShutter from 'mdi-material-ui/WindowShutter'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      sectionTitle: 'Platzhalter sectionTitle'
    },
    {
      title: 'Lieferanten',
      icon: AccountGroupOutline,
      path: '/Lieferanten'
    },
    {
      title: 'Lager',
      icon: WindowShutter,
      path: '/Lager'
    },
    {
      title: 'Einkauf',
      icon: CartOutline,
      path: '/Einkauf'
    },
    {
      title: 'Verkauf',
      icon: Finance,
      path: '/Verkauf'
    }
  ]
}

export default navigation
