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
import { useRef, useState} from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import LieferantKatalog from './LieferantKatalog'
import { ProductEntry } from './interfaces'

export default function LieferantenHinzufuegenDialog({
  open,
  handleClose,
  handleSave
}: {
  open: boolean
  handleClose: () => void
  handleSave: (lieferant: {
    name: string
    adresse: string
    contact: string
    status: number
    products: ProductEntry[]
  }) => void
}) {
  const [isActive, setIsActive] = useState(true)
  const [products, setProducts] = useState<ProductEntry[]>([])

  const nameRef = useRef<HTMLInputElement>(null)
  const adressRef = useRef<HTMLInputElement>(null)
  const contactRef = useRef<HTMLInputElement>(null)

  function onCreateLieferant() {

    const lieferant = {
      name: nameRef.current!.value,
      adresse: adressRef.current!.value,
      contact: contactRef.current!.value,
      status: (isActive)? 1 : 0,
      products: products
    }

    handleSave(lieferant)
    handleClose()
  }

  function onProductsUpdate(products: ProductEntry[]) {
    setProducts(products)
  }

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
            <Button autoFocus color='primary' variant='outlined' onClick={onCreateLieferant}>
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
                <TextField placeholder='Name*' inputRef={nameRef} required fullWidth variant='outlined' size='small' />
                <TextField
                  placeholder='Anschrift*'
                  inputRef={adressRef}
                  required
                  fullWidth
                  variant='outlined'
                  size='small'
                />
                <TextField
                  placeholder='Kontaktdaten*'
                  inputRef={contactRef}
                  required
                  fullWidth
                  variant='outlined'
                  size='small'
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={isActive} onChange={() => setIsActive(!isActive)} />}
                    label={isActive ? 'Status: Aktiv' : 'Status: Inaktiv'}
                  />
                </FormGroup>
                

              </Box>
            </Grid>
            <Grid item md={8}>
              <Typography variant='h6' align='center'>
                Katalog
              </Typography>
              <LieferantKatalog products={[]} onProductsUpdate={onProductsUpdate} isEditing={true} />
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
