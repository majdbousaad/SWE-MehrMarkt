import AppBar from '@mui/material/AppBar'

import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from 'mdi-material-ui/Close'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { v4 as uuidv4 } from 'uuid'
import { CardHeader } from '@mui/material'
import { formatDate } from 'src/lib/functions'

interface EinkaufProdukt {
    price: number,
    name:string,
    menge: number
}
export interface IEinkaufOne{
    vsl: string,
    tats: string
    gesamtPreis?: number,
    id?: number,
    products?: EinkaufProdukt[],
    lieferant?: string
}

export default function EinkaufSummary({
  einkauf,
  open,
  handleClose,
  arrived
}: {
  einkauf: IEinkaufOne
  open: boolean
  handleClose: () => void
  arrived: boolean
}) {
  

  function handleAbort() {
    handleClose()
  }

  return (
    <>
      <Dialog
        maxWidth='xl'
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '90%'
          }
        }}
        open={open}
        onClose={handleAbort}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleAbort} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
               Lieferungsdetailansicht Nummer {einkauf?.id} 
            </Typography>
          </Toolbar>
          <Card>
          <CardHeader title={'Lieferant: ' + einkauf?.lieferant} />
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Preis</TableCell>
                    <TableCell align='right'>Menge</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {einkauf?.products?.map(row => (
                    <TableRow key={uuidv4()}>
                      <TableCell component='th' scope='row'>
                        {row?.name}
                      </TableCell>
                      <TableCell align='right'>{row?.price}€</TableCell>
                      <TableCell align='right'>{row?.menge}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <br />
              {arrived && (
                <Typography variant="body2">
                    <strong> Lieferdatum: </strong> {formatDate(new Date(einkauf?.tats))}
                </Typography>
              )}
              <Typography variant="body2">
              <strong> Voraussichtliches Lieferdatum: </strong> {formatDate(new Date(einkauf?.vsl))}
              </Typography>
              <Typography variant="body2">
              <strong> Gesamtpreis: </strong> {einkauf?.gesamtPreis}€
              </Typography>
              
            </TableContainer>
          </CardContent>
        </Card>   
        </AppBar>
      </Dialog>
    </>
  )
}

