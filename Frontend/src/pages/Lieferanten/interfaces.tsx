export interface ProductEntry {
  name: string
  ean: string
  preis: number
}

export interface ILieferantJsonResponseAll {
    id: number
    address: string
    contact?: string
    deliveryTime: string
    name: string
    reliable: boolean
    status: boolean
  }

  export interface ILieferantJsonResponseOne {
    id: number
    address: string
    contact?: string
    deliveryTime: string
    name: string
    reliable: boolean
    status: boolean
    products: ICatalogProducts[]
  }

  export interface ICatalogProducts {
    id: string
    name: string
    ean: string
    price: number
  }

  export interface Lieferant {
    id: number
    name: string
    address: string
    contact?: string
    deliveryTime: string
    status: 'aktiv' | 'inaktiv'
    catalog: ICatalogProducts[]
  }