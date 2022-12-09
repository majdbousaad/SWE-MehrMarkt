import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Box, CardHeader, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import OpenInNew from 'mdi-material-ui/OpenInNew'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ILieferungAll{
  tats: string,
  id: number,
  lieferant: string,
  vsl: string

}

export default function EinkaufPage() {
  const [anstehendeLiefererungen, setAnstehendeLiefererungen] = useState<ILieferungAll[]>([])
  const [gelieferteLiefererungen, setGelieferteLiefererungen] = useState<ILieferungAll[]>([])

  useEffect(() => {
    fetchAnstehendeLiefererungen()
    fetchGelieferteLiefererungen()
  }, [])

  function fetchAnstehendeLiefererungen(): void {
    axios
      .get('http://localhost:8080/bestellung/anstehend')
      .then(response => {
        const anstehendeLiefererungenResponse = response.data as ILieferungAll[]
        setAnstehendeLiefererungen(anstehendeLiefererungenResponse)
      })
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }

  function fetchGelieferteLiefererungen(): void {
    axios
      .get('http://localhost:8080/bestellung/geliefert')
      .then(response => {
        const gelieferteLiefererungenResponse = response.data as ILieferungAll[]
        setGelieferteLiefererungen(gelieferteLiefererungenResponse)
      })
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }

  function orderArrived(orderId: number){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({angekommen:true})
    }
    fetch('http://localhost:8080/bestellung/' + orderId, requestOptions).then(response => {
      fetchAnstehendeLiefererungen()
    fetchGelieferteLiefererungen()
    })
  }

  return (
    <Card>
      <CardHeader title='Einkauf' />
      <CardContent>

      <Card>
        <CardHeader title='AnstehendeLieferungen' />
        <CardContent>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Lieferungsnummer</TableCell>
              <TableCell>Lieferant</TableCell>
              <TableCell>Vsl. Lieferdatum</TableCell>
              <TableCell>Zugestellt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {anstehendeLiefererungen?.map((anstehendeLiefererung: ILieferungAll) => (
              <TableRow hover key={anstehendeLiefererung.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{anstehendeLiefererung.id}</Typography>
                    <IconButton
                      color="primary"
                      size='small'
                      sx={{ p: 0, marginLeft: 1 }}
                      //onClick={() => orderArrived(anstehendeLiefererung.id)}
                    >
                      <OpenInNewIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{anstehendeLiefererung.lieferant}</TableCell>
                <TableCell>{anstehendeLiefererung.vsl}</TableCell>
                <TableCell><IconButton 
                      color="primary" 
                      aria-label="add to shopping cart"
                      onClick={() => orderArrived(anstehendeLiefererung.id)}
                      >
                      <DownloadDoneIcon />
                      </IconButton></TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title='GelieferteLieferungen' />
        <CardContent>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Lieferungsnummer</TableCell>
              <TableCell>Lieferant</TableCell>
              <TableCell>Lieferdatum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gelieferteLiefererungen?.map((gelieferteLiefererung: ILieferungAll) => (
              <TableRow hover key={gelieferteLiefererung.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{gelieferteLiefererung.id}</Typography>
                    <IconButton
                      color="primary"
                      size='small'
                      sx={{ p: 0, marginLeft: 1 }}
                      //onClick={() => onProfileDialogOpen(anstehendeLiefererung)}
                    >
                      <OpenInNewIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{gelieferteLiefererung.lieferant}</TableCell>
                <TableCell>{gelieferteLiefererung.tats}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>

        </CardContent>
      </Card>

      </CardContent>
    </Card>
  )
}

