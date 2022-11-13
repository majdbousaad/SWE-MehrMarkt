import { Card, Grid } from '@mui/material'
import LieferantenTabelle from './LieferantenTabelle'

export default function LieferantenPage() {
  return (
    <Card style={{ height: '100%' }}>
      <Grid container>
        <Grid item sm={12}>
          <LieferantenTabelle />
        </Grid>
      </Grid>
    </Card>
  )
}
