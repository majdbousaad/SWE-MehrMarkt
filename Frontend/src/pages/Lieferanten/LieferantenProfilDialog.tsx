import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from 'mdi-material-ui/Close'
import { useState } from 'react'
import LieferantKatalog from './LieferantKatalog'

import { v4 as uuidv4 } from 'uuid'
import { ICatalogProducts, ILieferantJsonResponseOne, ProductEntry } from '../../lib/interfaces'
import { LieferantProfilSection } from './LieferantProfilSection'
import { PlaceOrderDialog } from './PlaceOrderDialog'

export default function LieferantenProfilDialog({
  lieferant,
  initialLieferant,
  setLieferant,
  open,
  handleClose,
  fetchLieferanten
}: {
  lieferant: ILieferantJsonResponseOne
  initialLieferant: ILieferantJsonResponseOne
  setLieferant: (lieferant: ILieferantJsonResponseOne) => void
  open: boolean
  handleClose: () => void
  fetchLieferanten: () => void
}) {
  const [isDirty, setIsDirty] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const catalogWithID = lieferant?.products?.map(row => {
    return {
      id: uuidv4(),
      name: row.name,
      ean: row.ean,
      price: row.price
    }
  })

  const [products, setProducts] = useState<ProductEntry[]>(() => {
    const value = lieferant?.products?.map(row => {
      return {
        name: row.name,
        ean: row.ean,
        preis: row.price
      }
    })

    return value
  })

  function handleStartEditing() {
    setIsEditing(true)
  }

  function updateProductsBeimLieferant(rows: ICatalogProducts[]) {
    setLieferant({ ...lieferant, products: rows })
  }
  function handleSaveEditing() {
    setIsEditing(false)
    setIsDirty(JSON.stringify(initialLieferant) !== JSON.stringify(lieferant))

    console.log(initialLieferant)
    console.log(lieferant)
  }

  function onProductsUpdate(pProducts: ProductEntry[]) {
    setProducts(pProducts)
    console.log(pProducts)
  }
  async function updateLieferant() {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: lieferant.id,
        adresse: lieferant.address,
        contact: lieferant.contact,
        products: products,
        name: lieferant.name,
        status: lieferant.status ? 'aktiv' : 'inaktiv'
      })
    }

    await fetch('http://localhost:8080/lieferant/' + lieferant.id, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))
  }

  async function handleSave() {
    console.log(
      JSON.stringify({
        id: lieferant.id,
        adresse: lieferant.address,
        contact: lieferant.contact,
        products: products,
        name: lieferant.name,
        status: lieferant.status ? 'aktiv' : 'inaktiv'
      })
    )
    setIsDirty(false)
    await updateLieferant()

    fetchLieferanten()
    handleClose()
  }

  function handleAbort() {
    setIsDirty(false)
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
              Lieferanten Detailansicht
            </Typography>
            <Button
              autoFocus
              color='success'
              variant='contained'
              hidden={!isDirty}
              disabled={!isDirty}
              onClick={handleSave}
            >
              Änderungen speichern
            </Button>
            <PlaceOrderButton catalog={products} lieferant={lieferant} />
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Grid container>
            <Grid item md={4}>
              {lieferant && (
                <LieferantProfilSection
                  lieferant={lieferant}
                  setLieferant={setLieferant}
                  isEditing={isEditing}
                  handleStartEditing={handleStartEditing}
                  handleSaveEditing={handleSaveEditing}
                />
              )}
            </Grid>
            <Grid item md={8}>
              <Typography variant='h6' align='center'>
                Katalog
              </Typography>
              {lieferant && (
                <LieferantKatalog
                  onProductsUpdate={onProductsUpdate}
                  products={catalogWithID}
                  isEditing={isEditing}
                  updateProductsBeimLieferant={updateProductsBeimLieferant}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <style jsx global>{`
        .TextField-without-border-radius .MuiFilledInput-root {
          border-radius: 0px !important;
        }
      `}</style>
    </>
  )
}

export function DisplayEditingControl({
  handleSaveEditing,
  handleStartEditing,
  isEditing
}: {
  handleSaveEditing: () => void
  handleStartEditing: () => void
  isEditing: boolean
}) {
  if (isEditing) {
    return (
      <Button color='success' onClick={handleSaveEditing} variant='contained'>
        Speichern
      </Button>
    )
  } else {
    return (
      <Button color='info' onClick={handleStartEditing} variant='contained'>
        Bearbeiten
      </Button>
    )
  }
}

function PlaceOrderButton({ catalog, lieferant }: { catalog: ProductEntry[]; lieferant: ILieferantJsonResponseOne }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button sx={{ marginLeft: 2 }} autoFocus color='info' variant='contained' onClick={() => setIsDialogOpen(true)}>
        Bestellung aufgeben
      </Button>
      <PlaceOrderDialog isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} id={lieferant.id} />
    </>
  )
}
