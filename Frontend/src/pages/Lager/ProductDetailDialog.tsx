import { useEffect, useState } from 'react'
import { ILagerProduct } from './LagerPage'
import { Dialog, AppBar, Toolbar, IconButton, Typography, Button, Box, Grid, TextField, Tooltip } from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useSnackbar } from 'notistack'


export default function ProductDetailDialog({
  initialProduct,
  open,
  setOpen,
  fetchLagerProducts
}: {
  initialProduct: ILagerProduct
  open: boolean
  setOpen: (open: boolean) => void
  fetchLagerProducts: () => void
}) {
  const [isDirty, setIsDirty] = useState(false)
  const [product, setProduct] = useState(initialProduct)
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    setIsDirty(JSON.stringify(initialProduct) != JSON.stringify(product))
  }, [product])

  useEffect(() => {
    setProduct(initialProduct)
  }, [initialProduct])

  function handleAbort(): void {
    console.log('Function not implemented.')
    setOpen(false)
  }

  async function updateLagerProdukt(lagerProdukt:ILagerProduct) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lagerProdukt)
    }

    await fetch('http://localhost:8080/lagerprodukt/' + product.ean, requestOptions)
    .then(response => {
      if(response.status == 400){
        response.text().then(msg => enqueueSnackbar(msg, {variant: 'warning'}));
      }
    }).catch(() => {
      enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
    })
  }

  async function handleSave() {
     await updateLagerProdukt(product);
     await fetchLagerProducts();
    setOpen(false)
  }

  async function handleDelete() {
    // TODO: AXIOS PATCH OR PUT menge = 0
    await updateLagerProdukt({ ...product, menge: 0 });
    await fetchLagerProducts();
    enqueueSnackbar('Produkt wurde gelöscht', { variant: 'success' })
    setOpen(false)
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
