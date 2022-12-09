import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from 'mdi-material-ui/Close'
import DialogContent from '@mui/material/DialogContent'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@mui/material'
import { Ware, IOrderProductEntry, Bestellung } from 'src/lib/interfaces'

export function OrderDetailsDialog({
  isOpen,
  setIsDialogOpen,
  waren,
  rows,
  deleteFromWaren,
  lieferant_id
}: {
  isOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  waren: Ware[]
  rows: IOrderProductEntry[]
  deleteFromWaren: (ean:string) => void
  lieferant_id: number
}) {

  function handleClose() {
    setIsDialogOpen(false)
  }


  interface IOrderProductEntry {
    name: string
    ean: string
    price: number
    amount: number
  }

  function bestellen(waren: Ware[], lieferant_id: number){
    const bestellung: Bestellung = {
        lieferant: {id: lieferant_id},
        waren: waren,
        vslLieferdatum: "2024-12-03T10:15:30"
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bestellung)
      }
      console.log(bestellung)
    
      fetch('http://localhost:8080/bestellung', requestOptions).then(response => {
      
      console.log("if response status is 400, then lager is probably ausgelastet")
      console.log(response)
    })
    setIsDialogOpen(false)

  }
  
  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Bestellübersicht
          </Typography>
          <Button autoFocus color='success' variant='contained' onClick={() => bestellen(waren, lieferant_id)}>
            Betstellen!
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Card>
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Produktbezeichnung</TableCell>
                    <TableCell align='right'>Menge</TableCell>
                    <TableCell align='right'>Löschen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {waren.map(row => (
                    <TableRow key={row.product.ean}>
                      <TableCell component='th' scope='row'>
                        {rows.find(s => s.ean == row.product.ean)?.name}
                      </TableCell>
                      <TableCell align='right'>{row.menge}</TableCell>
                      <TableCell align='right'><Button variant='outlined' onClick={() => {deleteFromWaren(row.product.ean);}}>Löschen</Button></TableCell>
                        
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
