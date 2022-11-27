import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import LieferantenHinzufuegenButton from './LieferantenHinzufuegenButton'
import LieferantenTabelle, { Lieferant } from './LieferantenTabelle'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface ILieferantJsonResponse {
  address: string
  contact?: string
  deliveryTime: string
  name: string
  reliable: boolean
  status: boolean
}

export default function LieferantenPage() {
  const [lieferanten, setLieferanten] = useState<Lieferant[]>([])

  useEffect(() => {
    axios.get('http://localhost:8080/lieferant').then(response => {
      //TODO: Delete this console.log when done
      console.log(response.data)
      const lieferantenResponse = response.data as ILieferantJsonResponse[]
      setLieferanten(
        lieferantenResponse.map(lieferant => ({
          name: lieferant.name,
          address: lieferant.address,
          contact: lieferant.contact,
          deliveryTime: lieferant.deliveryTime,
          status: lieferant.status ? 'aktiv' : 'inaktiv'
        }))
      )
    })
  }, [])

  return (
    <Card>
      <CardHeader title='Lieferanten' action={<LieferantenHinzufuegenButton />} />
      <CardContent>
        <LieferantenTabelle lieferanten={lieferanten} />
      </CardContent>
    </Card>
  )
}
