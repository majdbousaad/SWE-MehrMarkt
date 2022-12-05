import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CloseIcon from 'mdi-material-ui/Close'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import LieferantKatalog from './LieferantKatalog'

import { v4 as uuidv4 } from 'uuid'
import { ILieferantJsonResponseOne, ProductEntry } from '../../lib/interfaces'
import { LieferantProfilSection } from './LieferantProfilSection'

export default function LieferantenProfilDialog({
  lieferant,
  initialLieferant,
  setLieferant,
  open,
  handleClose
}: {
  lieferant: ILieferantJsonResponseOne
  initialLieferant: ILieferantJsonResponseOne
  setLieferant: (lieferant: ILieferantJsonResponseOne) => void
  open: boolean
  handleClose: () => void
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

  function handleSaveEditing() {
    setIsEditing(false)
    setIsDirty(JSON.stringify(initialLieferant) !== JSON.stringify(lieferant))

    console.log(initialLieferant)
    console.log(lieferant)
  }

  function onProductsUpdate(products: ProductEntry[]) {
    setProducts(products)
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

    handleClose()
  }

  function handleAbort() {
    setIsDirty(false)
    handleClose()
  }

  function handleCreateOrder() {
    console.log('create order')
  }

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleAbort}>
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
              Änderungen speicherns
            </Button>
            <Button sx={{ marginLeft: 2 }} autoFocus color='info' variant='contained' onClick={handleCreateOrder}>
              Bestellung aufgeben
            </Button>
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
                <LieferantKatalog onProductsUpdate={onProductsUpdate} products={catalogWithID} isEditing={isEditing} />
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
