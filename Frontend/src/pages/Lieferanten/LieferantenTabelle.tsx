import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import OpenInNew from 'mdi-material-ui/OpenInNew'
import LieferantenProfilDialog from './LieferantenProfilDialog'
import { useState } from 'react'

export interface Lieferant {
  name: string
  address: string
  contact?: string
  deliveryTime: string
  status: 'aktiv' | 'inaktiv'
}
{
  /*
const rows: Lieferant[] = [
  {
    name: 'Lieferant 1',
    address: 'Musterstrasse 1, 1234 Musterstadt',
    contact: 'Herr Mustermann',
    deliveryTime: '1 Tag, 4 Stunden',
    status: 'aktiv'
  },
  {
    name: 'Lieferant 3',
    address: 'Musterstrasse 3, 1234 Musterstadt',
    contact: 'Herr Mustermann',
    deliveryTime: '1 Tag, 2 Stunden',
    status: 'aktiv'
  },
  {
    name: 'Lieferant 2',
    address: 'Musterstrasse 2, 1234 Musterstadt',
    contact: 'Herr Mustermann',
    deliveryTime: '1 Tag',
    status: 'inaktiv'
  }
]
*/
}

export default function LieferantenTabelle({ lieferanten }: { lieferanten: Lieferant[] }) {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  function onProfileDialogClose() {
    setProfileDialogOpen(false)
  }

  function onProfileDialogOpen() {
    setProfileDialogOpen(true)
  }

  return (
    <>
      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Kontaktdaten</TableCell>
              <TableCell>Lieferzeit</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lieferanten.map((lieferant: Lieferant) => (
              <TableRow hover key={lieferant.name}>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{lieferant.name}</Typography>
                    <IconButton size='small' sx={{ p: 0, marginLeft: 1 }} onClick={onProfileDialogOpen}>
                      <OpenInNew fontSize='small' />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{lieferant.address}</TableCell>
                <TableCell>{lieferant.contact}</TableCell>
                <TableCell>{lieferant.deliveryTime}</TableCell>
                <TableCell>
                  <Chip
                    label={lieferant.status}
                    color={lieferant.status === 'aktiv' ? 'success' : 'secondary'}
                    size='small'
                    sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <LieferantenProfilDialog open={profileDialogOpen} handleClose={onProfileDialogClose} />
    </>
  )
}
