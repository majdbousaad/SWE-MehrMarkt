import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useEffect, useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import {
  Button,
  CardHeader,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material'
import { useSnackbar } from 'notistack'
import Pencil from 'mdi-material-ui/Pencil'
import Dialog from '@mui/material/Dialog'
import ProductDetailDialog from './ProductDetailDialog'

export interface ILagerProduct {
  name: string
  menge: number
  lagerort: string
  preis: string
  ean: string
}

export default function LagerPage() {
  const [lagerProducts, setLagerProducts] = useState<ILagerProduct[]>([])
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
  const [dialogProduct, setDialogProduct] = useState(lagerProducts[0])

  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    fetchLagerProducts()
  }, [])

  function fetchLagerProducts(): void {
    axios
      .get('http://localhost:8080/lagerprodukt')
      .then(response => {
        const lagerProductsResponse = response.data as ILagerProduct[]
        setLagerProducts(lagerProductsResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
      })
  }

  return (
    <Card>
      <CardHeader title='Lager' />
      <CardContent>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table className='w-full'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Menge</TableCell>
                <TableCell>Lagerort</TableCell>
                <TableCell>Preis</TableCell>
                <TableCell align='center'>Detailansicht</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lagerProducts?.map((lagerProduct: ILagerProduct) => (
                <TableRow hover key={lagerProduct.ean}>
                  <TableCell>{lagerProduct.name}</TableCell>
                  <TableCell>{lagerProduct.menge}</TableCell>
                  <TableCell>
                    <EditLagerButton Product={lagerProduct} fetchLagerProducts={fetchLagerProducts} />
                    {lagerProduct.lagerort}
                  </TableCell>
                  <TableCell>{lagerProduct.preis}</TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='primary'
                      aria-label='add to shopping cart'
                      onClick={() => {
                        setIsProductDetailsOpen(true)
                        setDialogProduct(lagerProduct)
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <ProductDetailDialog
                initialProduct={dialogProduct}
                open={isProductDetailsOpen}
                setOpen={setIsProductDetailsOpen}
                fetchLagerProducts={fetchLagerProducts}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

type lagerEntrys = {
  standard: boolean
  name: string
}

function EditLagerButton({ Product, fetchLagerProducts }: { Product: ILagerProduct; fetchLagerProducts: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectValue, setSelectValue] = useState(Product.lagerort.toLowerCase())
  const [newLocation, setNewLocation] = useState('')

  const [locations, setLocations] = useState([
    {
      value: 'other',
      label: 'Neuer Standort'
    }
  ])

  const { enqueueSnackbar } = useSnackbar()

  function handleClose(): void {
    setNewLocation('')
    setSelectValue(Product.lagerort.toLowerCase())
    setIsOpen(false)
  }

  useEffect(() => {
    axios.get('http://localhost:8080/lager/namen').then(response => {
      console.log(response.data)
      let entry: lagerEntrys

      const newLocations = [
        {
          value: 'other',
          label: 'Neuer Standort'
        }
      ]

      for (entry of response.data) {
        if (entry.name !== '') {
          newLocations.push({
            value: entry.name.toLowerCase(),
            label: entry.name
          })
        }
      }

      setLocations(newLocations)
    })
  }, [])

  function handleConfirm(): void {
    let result = ''

    if (newLocation === '') {
      result = locations.find(location => location.value === selectValue)?.label || ''
    } else {
      result = newLocation
    }

    axios
      .patch(`http://localhost:8080/lagerprodukt/${Product.ean}`, [
        {
          op: 'replace',
          path: '/lagerort',
          value: result
        }
      ])

      .then((response) => {
        console.log(response.data)
        enqueueSnackbar('Standort wurde geändert', { variant: 'success' })
        setNewLocation(result)
        fetchLagerProducts()
      })
      .catch((e: any) => {
        enqueueSnackbar(e.response.data, { variant: 'error' })
      })

    setIsOpen(false)
  }

  return (
    <>
      <IconButton size='small' onClick={() => setIsOpen(true)}>
        <Pencil />
      </IconButton>
      <Dialog open={isOpen}>
        <DialogTitle>Standort ändern</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Um einen anderen Standort zu wählen, geben sie bitten den Namen des neuen Standorts ein.
          </DialogContentText>
          {selectValue === 'other' ? (
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              label='Neuer Standort'
              onChange={(event: any) => setNewLocation(event.target.value)}
            ></TextField>
          ) : (
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              select
              label='Select'
              value={selectValue}
              onChange={(event: any) => setSelectValue(event.target.value)}
              helperText='Bitte wähle einen standort'
            >
              {locations.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Abbrechen</Button>
          <Button onClick={handleConfirm}>Auswählen</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}