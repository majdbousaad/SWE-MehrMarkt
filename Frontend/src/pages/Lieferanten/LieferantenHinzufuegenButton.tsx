import Button from '@mui/material/Button'
import { useState } from 'react'
import { ProductEntry } from '../../lib/interfaces'
import LieferantenHinzufuegenDialog from './LieferantenHinzufuegenDialog'
import {useSnackbar} from 'notistack'

export default function LieferantenHinzufuegenButton({ fetchLieferanten }: { fetchLieferanten: () => void }) {
  const [open, setOpen] = useState(false)
  const {enqueueSnackbar} = useSnackbar()
  function handleSave(lieferant: {
    name: string
    adresse: string
    contact: string
    status: number
    products: ProductEntry[]
  }): void {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lieferant)
    }
    fetch('http://localhost:8080/lieferant', requestOptions).then((response) => {
      if(response.status == 400){
        enqueueSnackbar('Mehrere Produkte mit gleicher EAN Nummer', {variant: 'warning'})
      }
      fetchLieferanten()
    }).catch(() => {
      enqueueSnackbar('Es gibt Keine Verbindung zur DatenBank', {variant: 'error'})
    })

    //setOpen(false)
  }

  function handleClose(): void {
    setOpen(false)
  }

  function handleOpen() {
    setOpen(true)
  }

  return (
    <>
      <Button size='small' color='info' variant='contained' onClick={handleOpen}>
        Lieferant hinzufügen
      </Button>
      <LieferantenHinzufuegenDialog open={open} handleClose={handleClose} handleSave={handleSave} />
    </>
  )
}
