import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import LieferantenHinzufuegenButton from './LieferantenHinzufuegenButton'
import LieferantenTabelle from './LieferantenTabelle'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Lieferant, ILieferantJsonResponseAll } from '../../lib/interfaces'

export default function LieferantenPage() {
  const [lieferanten, setLieferanten] = useState<Lieferant[]>([])

  useEffect(() => {
    fetchLieferanten()
  }, [])

  function fetchLieferanten(): void {
    axios
      .get('http://localhost:8080/lieferant')
      .then(response => {
        const lieferantenResponse = response.data as ILieferantJsonResponseAll[]
        setLieferanten(
          lieferantenResponse.map(lieferant => ({
            id: lieferant.id,
            name: lieferant.name,
            address: lieferant.address,
            contact: lieferant.contact,
            deliveryTime: lieferant.deliveryTime,
            status: lieferant.status ? 'aktiv' : 'inaktiv',
            catalog: [],
            reliable: lieferant.reliable
          }))
        )
      })
      .catch(() => {
        alert('Es gibt keine Verbindung zur Datenbank')

      })
  }

  return (
    <Card>
      <CardHeader title='Lieferanten' action={<LieferantenHinzufuegenButton fetchLieferanten={fetchLieferanten} />} />
      <CardContent>
        <LieferantenTabelle lieferanten={lieferanten} fetchLieferanten={fetchLieferanten} />
      </CardContent>
    </Card>
  )
}
