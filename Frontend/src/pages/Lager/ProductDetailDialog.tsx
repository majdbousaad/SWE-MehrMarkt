import { useEffect, useState } from 'react'
import { ILagerProduct } from './LagerPage'
import { Dialog, AppBar, Toolbar, IconButton, Typography, Button, Box, Grid, TextField, Tooltip } from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'

export default function ProductDetailDialog({
  initialProduct,
  open,
  setOpen
}: {
  initialProduct: ILagerProduct
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [isDirty, setIsDirty] = useState(false)
  const [product, setProduct] = useState(initialProduct)

  useEffect(() => {
    setIsDirty(JSON.stringify(initialProduct) != JSON.stringify(product))
  }, [product])

  useEffect(() => {
    setProduct(initialProduct)
  }, [initialProduct])

  function handleAbort(event: any): void {
    console.log('Function not implemented.')
    setOpen(false)
  }

  function handleSave(event: any): void {
    console.log('Function not implemented.')
    // TODO: AXIOS PATCH OR PUT
    setOpen(false)
  }

  function handleDelete(event: any): void {
    // TODO: AXIOS PATCH OR PUT menge = 0
    console.log('delete')
  }

  return (
    <>
      <Dialog maxWidth='xl' open={open} onClose={handleAbort}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleAbort} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <div className='flex flex-row gap-2 w-full'>
              <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                Produkt Detailansicht
              </Typography>
              <Tooltip title='Das Produkt verschwindet nicht aus dem Lager, die Menge wird legilich auf 0 gesetzt'>
                <Button color='error' variant='contained' onClick={handleDelete}>
                  Produkt löschen
                </Button>
              </Tooltip>
              <Button color='success' variant='contained' hidden={!isDirty} disabled={!isDirty} onClick={handleSave}>
                Änderungen speichern
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Grid container>
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              defaultValue={initialProduct?.name}
              label='Name'
              onChange={(event: any) => setProduct({ ...product, name: event.target.value })}
            />
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              defaultValue={initialProduct?.menge}
              type='number'
              label='Menge'
              onChange={(event: any) => setProduct({ ...product, menge: event.target.value })}
            />
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              defaultValue={initialProduct?.preis}
              type='number'
              label='Preis'
              onChange={(event: any) => setProduct({ ...product, preis: event.target.value })}
            />
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}
