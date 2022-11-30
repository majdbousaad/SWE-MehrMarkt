import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CloseIcon from 'mdi-material-ui/Close'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import { useState } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import LieferantKatalog  from './LieferantKatalog'

import { v4 as uuidv4 } from 'uuid'
import { ILieferantJsonResponseOne, ProductEntry } from './interfaces'
import axios from 'axios'


function createData(id: string, name: string, ean: string, price: number) {
  return { id, name, ean, price }
}

export default function LieferantenProfilDialog({
  lieferant,
  open,
  handleClose,
  fetchLieferanten
}: {
  lieferant: ILieferantJsonResponseOne
  open: boolean
  handleClose: () => void
  fetchLieferanten: () => void
}) {
  const [isActive, setIsActive] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  //const [lieferant, setLieferant] = useState<ILieferantJsonResponseOne>(profielDialogLieferant)
  
  const catalogWithID = lieferant.products.map(row => {
    return {
      id: uuidv4(),
      name: row.name,
      ean: row.ean,
      price: row.price
    }
  })

  const [products, setProducts] = useState<ProductEntry[]>(() =>{
    const value = lieferant.products.map(row => {
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
    setIsDirty(true)
  }
  
  function onProductsUpdate(products: ProductEntry[] ){
      setProducts(products)
  }
  async function updateLieferant(){
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify ({
        id: lieferant.id,
        adresse: lieferant.address,
        contact: lieferant.contact,
        products: products,
        name: lieferant.name,
        status: (isActive)? 'aktiv' : 'inaktiv'

      })
  };

   await fetch('http://localhost:8080/lieferant/' + lieferant.id, requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
  }
  
    async function handleSave() {
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
      <Dialog fullScreen open={open} onClose={handleAbort}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleAbort} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Lieferanten Detailansicht
            </Typography>
            <Button autoFocus color='success' variant='contained' disabled={!isDirty} onClick={handleSave}>
              Änderungen speichern

            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Grid container>
            <Grid item md={4}>
              {lieferant && (
                <LieferantProfilSection
                  lieferant={lieferant}
                  isEditing={isEditing}
                  isActive={isActive}
                  setIsActive={setIsActive}
                  handleStartEditing={handleStartEditing}
                  handleSaveEditing={handleSaveEditing}
                />
              )}
            </Grid>
            <Grid item md={8}>
              <Typography variant='h6' align='center'>
                Katalog
              </Typography>
              {lieferant && <LieferantKatalog onProductsUpdate={onProductsUpdate} products={catalogWithID} isEditing={isEditing} />}
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

function LieferantProfilSection({
  lieferant,
  isEditing,
  isActive,
  setIsActive,
  handleSaveEditing,
  handleStartEditing
}: {
  lieferant: ILieferantJsonResponseOne
  isEditing: boolean
  isActive: boolean
  setIsActive: (value: boolean) => void
  handleSaveEditing: () => void
  handleStartEditing: () => void
}) {
  return (
    <>
      <Typography variant='h6' align='center'>
        Profil
      </Typography>
      <Box className='p-5 flex flex-col gap-4'>
        <TextField
          placeholder='Name*'
          defaultValue={lieferant.name}
          disabled={!isEditing}
          onChange={e => lieferant.name= e.target.value}
          fullWidth
          variant={isEditing ? 'outlined' : 'standard'}
          size='small'
        />
        <TextField
          placeholder='Anschrift*'
          defaultValue={lieferant.address}
          onChange={e => lieferant.address = e.target.value}
          disabled={!isEditing}
          fullWidth
          variant={isEditing ? 'outlined' : 'standard'}
          size='small'
        />
        <TextField
          placeholder='Kontaktdaten*'
          defaultValue={lieferant.contact}
          onChange={e => lieferant.contact= e.target.value}
          disabled={!isEditing}
          fullWidth
          variant={isEditing ? 'outlined' : 'standard'}
          size='small'
        />
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} />}
            label={isActive ? 'Aktiv' : 'Inaktiv'}
            disabled={!isEditing}
          />
        </FormGroup>
        
        <DisplayEditingControl
          handleSaveEditing={handleSaveEditing}
          handleStartEditing={handleStartEditing}
          isEditing={isEditing}
        />
      </Box>
    </>
  )
}

function DisplayEditingControl({
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
