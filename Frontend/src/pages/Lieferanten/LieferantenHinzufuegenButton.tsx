import Button from '@mui/material/Button'
import { useState } from 'react'
import LieferantenHinzufuegenDialog from './LieferantenHinzufuegenDialog'
import { ProductEntry } from './LieferantKatalog'

export default function LieferantenHinzufuegenButton() {
  const [open, setOpen] = useState(false)

  function handleSave(lieferant: {
    name: string
    address: string
    contact: string
    active: boolean
    products: ProductEntry[]
  }): void {
    console.log(lieferant)
    console.log(JSON.stringify(lieferant))

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
