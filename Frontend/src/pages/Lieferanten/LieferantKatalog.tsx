import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import { v4 as uuidv4 } from 'uuid'

import { useRef, useState } from 'react'
import { ICatalogProducts } from './LieferantenProfilDialog'

export interface ProductEntry {
  name: string
  ean: string
  price: number
}

export default function LieferantKatalog({
  products,
  onProductsUpdate
}: {
  products: ICatalogProducts[]
  onProductsUpdate: (products: ProductEntry[]) => void
}) {
  function createData(id: string, name: string, ean: string, price: number) {
    return { id, name, ean, price }
  }

  const [rows, setRows] = useState(products)

  function updateProduct(id: string, name: string, ean: string, price: number) {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return createData(id, name, ean, price)
      } else {
        return row
      }
    })
    setRows(newRows)
    const catalog = newRows.map(row => {
      return {
        name: row.name,
        ean: row.ean,
        price: row.price
      }
    })
    onProductsUpdate(catalog)
  }

  function onAddProduct() {
    setRows([...rows, createData(uuidv4(), '', '', 0)])
  }

  return (
    <Card raised={true}>
      <CardContent>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>EAN-Nummer</TableCell>
                <TableCell>Preis</TableCell>
                <TableCell align='center'>
                  <Button size='small' variant='contained' onClick={() => onAddProduct()}>
                    Produkt hinzufügen
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map(row => (
                <>
                  {row.name === '' ? (
                    <KatalogProdukt
                      key={'id-' + row.ean}
                      id={row.id}
                      updateProduct={updateProduct}
                      name={row.name}
                      ean={row.ean}
                      price={row.price}
                      forceEditing
                    />
                  ) : (
                    <KatalogProdukt
                      key={'id-' + row.ean}
                      id={row.id}
                      updateProduct={updateProduct}
                      name={row.name}
                      ean={row.ean}
                      price={row.price}
                    />
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

function KatalogProdukt({
  id,
  name,
  ean,
  price,
  updateProduct,
  forceEditing
}: {
  id: string
  name: string
  ean: string
  price: number
  updateProduct: (id: string, name: string, ean: string, price: number) => void
  forceEditing?: boolean
}) {
  const [isEditing, setIsEditing] = useState(forceEditing?.valueOf() ?? false)

  const nameRef = useRef<any>(null)
  const EANRef = useRef<any>(null)
  const priceRef = useRef<any>(null)

  function onSave() {
    updateProduct(id, nameRef.current.value, EANRef.current.value, parseFloat(priceRef.current.value))
    setIsEditing(false)
  }

  return (
    <>
      {!isEditing ? (
        <TableRow key={name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell component='th' scope='row'>
            <Typography>{name}</Typography>
          </TableCell>
          <TableCell align='left'>
            <Typography>{ean}</Typography>
          </TableCell>
          <TableCell align='left'>
            <Typography>{price}€</Typography>
          </TableCell>
          <TableCell align='center'>
            <Button size='small' color='primary' variant='outlined' onClick={() => setIsEditing(true)}>
              Bearbeiten
            </Button>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow key={name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell component='th' scope='row'>
            <TextField
              inputRef={nameRef}
              defaultValue={name}
              placeholder={'Name'}
              fullWidth
              variant='outlined'
              size='small'
            />
          </TableCell>
          <TableCell align='left'>
            <TextField
              inputRef={EANRef}
              defaultValue={ean}
              placeholder={'EAN-Nummer'}
              fullWidth
              variant='outlined'
              size='small'
            />
          </TableCell>
          <TableCell align='left'>
            <TextField
              inputRef={priceRef}
              defaultValue={forceEditing ? null : price}
              placeholder={'Preis'}
              fullWidth
              variant='outlined'
              size='small'
            />
          </TableCell>
          <TableCell align='center'>
            <Button size='small' color='success' variant='outlined' onClick={() => onSave()}>
              Speichern
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
