import Button from '@mui/material/Button'
import { useState } from 'react'
import LieferantenHinzufuegenDialog from './LieferantenHinzufuegenDialog'

export default function LieferantenHinzufuegenButton() {
  const [open, setOpen] = useState(false)

  function handleClose() {
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
      <LieferantenHinzufuegenDialog open={open} handleClose={handleClose} />
    </>
  )
}
