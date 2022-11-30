import Button from '@mui/material/Button'
import { useState } from 'react'
import { ProductEntry } from './interfaces'
import LieferantenHinzufuegenDialog from './LieferantenHinzufuegenDialog'

export default function LieferantenHinzufuegenButton({ fetchLieferanten }: { fetchLieferanten: () => void }) {
  const [open, setOpen] = useState(false)

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
    fetch('http://localhost:8080/lieferant', requestOptions).then(response => {
      console.log(requestOptions)
      console.log(response)
      fetchLieferanten()
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
