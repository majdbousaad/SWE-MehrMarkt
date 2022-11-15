import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import LieferantenHinzufuegenButton from './LieferantenHinzufuegenButton'
import LieferantenTabelle from './LieferantenTabelle'

export default function LieferantenPage() {
  return (
    <Card>
      <CardHeader title='Lieferanten' action={<LieferantenHinzufuegenButton />} />
      <CardContent>
        <LieferantenTabelle />
      </CardContent>
    </Card>
  )
}
