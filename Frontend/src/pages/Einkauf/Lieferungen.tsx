import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import { ILieferungAll } from './EinkaufPage'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { TableContainer } from '@mui/material'
import EinkaufSummary, { IEinkaufOne } from './EinkaufSummary'
import {useState} from 'react'
import axios from 'axios'
import {useSnackbar} from 'notistack'
import { formatDate } from 'src/lib/functions'

export default function Lieferungen({ lieferungen, orderArrived, arrived }: { lieferungen: ILieferungAll[], orderArrived: (lieferung_id: number) => void, arrived: boolean}) {
  

  async function fetchEinkauf(einkauf_id: number) {
    await axios
      .get('http://localhost:8080/bestellung/' + einkauf_id)
      .then(response => {
        const einkaufResponse = response.data as IEinkaufOne
        setEinkauf(einkaufResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})

      })
  }

  const [einkauf, setEinkauf] = useState<IEinkaufOne>()
  const [einkaufDialogOpen, setEinkaufDialogOpen] = useState(false)
  const {enqueueSnackbar} = useSnackbar()

  function onEinkaufDialogClose() {
    setEinkaufDialogOpen(false)
  }
  async function onEinkaufDialogOpen(einkauf_id: number) {
    await fetchEinkauf(einkauf_id)

    setEinkaufDialogOpen(true)
  }
  
  return (
    <>
      <Card>
        <CardHeader title={arrived? 'Gelieferte Bestellungen' : 'Ausstehende Lieferungen'} />
        <CardContent>
        <TableContainer sx={{maxHeight:300}}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Lieferungsnummer</TableCell>
                <TableCell>Lieferant</TableCell>
                <TableCell>{arrived? 'Lieferdatum': 'Vsl. Lieferdatum'}</TableCell>
                {!arrived &&(<TableCell>Zugestellt</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {lieferungen?.map((lieferung: ILieferungAll) => (
                <TableRow hover key={lieferung.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{lieferung.id}</Typography>
                      <IconButton
                        color="primary"
                        size='small'
                        sx={{ p: 0, marginLeft: 1 }}
                        
                        onClick={() => onEinkaufDialogOpen(lieferung.id)}
                      >
                        <OpenInNewIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{lieferung.lieferant}</TableCell>
                  <TableCell>{arrived? formatDate(new Date(lieferung.tats)): formatDate(new Date(lieferung.vsl))}</TableCell>
                  {!arrived && (
                  <TableCell><IconButton 
                        color="primary" 
                        aria-label="add to shopping cart"
                        onClick={() => orderArrived(lieferung.id)}
                        >
                        <DownloadDoneIcon />
                        </IconButton>
                  </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </CardContent>
      </Card>
      {einkauf && (
      <EinkaufSummary handleClose={onEinkaufDialogClose} open={einkaufDialogOpen} einkauf={einkauf} arrived={arrived}/>
      )}
    </>
  )
}
