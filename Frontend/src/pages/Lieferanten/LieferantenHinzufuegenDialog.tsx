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
import LieferantKatalog from './LieferantKatalog'

interface ILiferant {
  name: string
  adress: string
  contact: string
  deliveryTime: string
  status: 'aktiv' | 'inaktiv'
  catalog: ICatalogProducts[]
}

interface ICatalogProducts {
  name: string
  price: number
}

const lieferant: ILiferant = {
  name: 'Lieferant 1',
  adress: 'Musterstrasse 1, 1234 Musterstadt',
  contact: 'Herr Mustermann',
  deliveryTime: '1 Tag, 4 Stunden',
  status: 'aktiv',
  catalog: [
    {
      name: 'Produkt 1',
      price: 10
    },
    {
      name: 'Produkt 2',
      price: 20
    },
    {
      name: 'Produkt 3',
      price: 30
    }
  ]
}

export default function LieferantenHinzufuegenDialog({
  open,
  handleClose
}: {
  open: boolean
  handleClose: () => void
}) {
  const [isActive, setIsActive] = useState(true)

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Lieferant Hinzufügen
            </Typography>
            <Button autoFocus color='primary' variant='outlined' onClick={handleClose}>
              Erstellen
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Grid container>
            <Grid item md={4}>
              <Typography variant='h6' align='center'>
                Profil
              </Typography>
              <Box className='p-5 flex flex-col gap-4'>
                <TextField placeholder='Name*' required fullWidth variant='outlined' size='small' />
                <TextField placeholder='Anschrift*' required fullWidth variant='outlined' size='small' />
                <TextField placeholder='Kontaktdaten*' required fullWidth variant='outlined' size='small' />
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} />}
                    label={isActive ? 'Status: Aktiv' : 'Status: Inaktiv'}
                  />
                </FormGroup>
                <Box className='TextField-without-border-radius'>
                  <Typography className='pb-3' variant='body2' align='left'>
                    Lieferzeit
                  </Typography>
                  <Grid container justifyContent='space-between'>
                    <Grid item md={4}>
                      <TextField type='number' defaultValue={0} fullWidth variant='filled' size='small' label='Tage' />
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        type='number'
                        defaultValue={0}
                        fullWidth
                        variant='filled'
                        size='small'
                        label='Stunden'
                      />
                    </Grid>
                    <Grid item md={4}>
                      <TextField
                        type='number'
                        defaultValue={0}
                        fullWidth
                        variant='filled'
                        size='small'
                        label='Minuten'
                        sx={{
                          '& fieldset': {
                            borderRadius: '220px'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item md={8}>
              <Typography variant='h6' align='center'>
                Katalog
              </Typography>
              <LieferantKatalog catalog={[]} />
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
