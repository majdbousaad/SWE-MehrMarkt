import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import LieferantenHinzufuegenButton from './LieferantenHinzufuegenButton'
import LieferantenTabelle, {Lieferant} from './LieferantenTabelle'
import {useEffect, useState} from "react";

export default function LieferantenPage() {

  const [lieferanten, setLieferanten] = useState<Lieferant[]>( [])

  useEffect(() => {
    fetch('http://localhost:8080/lieferant')
      .then((res) => res.json())
      .then((data) => {
        setLieferanten(data)
      })
  }, [])

  return (
    <Card>
      <CardHeader title='Lieferanten' action={<LieferantenHinzufuegenButton />} />
      <CardContent>
        <LieferantenTabelle lieferanten={lieferanten}/>
      </CardContent>
    </Card>
  )
}
