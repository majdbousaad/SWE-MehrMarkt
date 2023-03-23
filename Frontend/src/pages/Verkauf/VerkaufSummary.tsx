import AppBar from '@mui/material/AppBar'

import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import DownloadIcon from '@mui/icons-material/Download';
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
import React from 'react';
import Rechnung from '../PDFs/Rechnung'
import { PDFDownloadLink } from '@react-pdf/renderer'

interface VerkaufProdukt {
  price: number
  name: string
  menge: number
}
export interface IVerkaufOne {
  Datum: string
  gesamtPreis?: number
  id?: number
  products?: VerkaufProdukt[]
}

export default function VerkaufSummary({
  verkauf,
  open,
  handleClose
}: {
  verkauf: IVerkaufOne
  open: boolean
  handleClose: () => void
}) {
  function handleAbort() {
    handleClose()
  }

  if (!verkauf) {
    return <></>
  }
  if (!verkauf.Datum) {
    return <></>
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
              Verkaufübersicht
            </Typography>
          </Toolbar>
          <Card>
            <CardHeader title={'Warenkorb: ' + verkauf?.id} />
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
                    {verkauf?.products?.map(row => (
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
                <Typography variant='body2'>
                  <strong>Datum:</strong> {formatDate(new Date(verkauf ? verkauf.Datum : ''))}
                </Typography>
                <Typography variant='body2'>
                  <strong>Gesamtpreis:</strong> {verkauf?.gesamtPreis}€
                </Typography>
              </TableContainer>
              <PDFDownloadLink
                document={<Rechnung verkauf={verkauf} />}
                fileName={'Rechnung-' + verkauf ? verkauf.Datum : '' + '.pdf'}
              >
                {() => (
                  <IconButton id='download' edge='start' color='inherit' aria-label='close'>
                    <DownloadIcon />
                  </IconButton>
                )}
              </PDFDownloadLink>
            </CardContent>
          </Card>
        </AppBar>
      </Dialog>
    </>
  )
}

