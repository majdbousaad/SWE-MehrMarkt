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
      path: '/'
    },
    {
      title: 'Lager',
      icon: WindowShutter,
      path: '/'
    },
    {
      title: 'Einkauf',
      icon: CartOutline,
      path: '/'
    },
    {
      title: 'Verkauf',
      icon: Finance,
      path: '/'
    }
  ]
}

export default navigation
