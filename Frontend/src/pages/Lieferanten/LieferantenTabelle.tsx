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
import LieferantenProfilDialog  from './LieferantenProfilDialog'
import { useState, useEffect } from 'react'
import { ICatalogProducts, Lieferant, ILieferantJsonResponseOne } from './interfaces'
import axios from 'axios'



export default function LieferantenTabelle(
  { 
    lieferanten, 
    fetchLieferanten 
  }: 
  { 
    lieferanten: Lieferant[]
     fetchLieferanten : () => void
    }) {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [profielDialogLieferant, setProfielDialogLieferant] = useState<ILieferantJsonResponseOne>()

  function onProfileDialogClose() {
    setProfileDialogOpen(false)
  }

  async function fetchLieferant(lieferant: Lieferant){
    await axios.get("http://localhost:8080/lieferant/" + lieferant.id).then(response => {
      //TODO: Delete this console.log when done
      console.log(response)
      const lieferantenResponse = response.data as ILieferantJsonResponseOne
      setProfielDialogLieferant(lieferantenResponse)
      console.log(profielDialogLieferant)
    })
  }

  async function onProfileDialogOpen(lieferant: Lieferant) {

    await fetchLieferant(lieferant)
    
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
                    <IconButton
                      size='small'
                      sx={{ p: 0, marginLeft: 1 }}
                      onClick={() => onProfileDialogOpen(lieferant)}
                    >
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
      {profielDialogLieferant && (
      <LieferantenProfilDialog
        lieferant={profielDialogLieferant}
        open={profileDialogOpen}
        handleClose={onProfileDialogClose}
        fetchLieferanten={fetchLieferanten}
      />)}
    </>
  )
}
