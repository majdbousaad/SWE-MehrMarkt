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
import { ICatalogProducts, ProductEntry } from '../../lib/interfaces'

export default function LieferantKatalog({
  products,
  onProductsUpdate,
  isEditing,
  updateProductsBeimLieferant
}: {
  products: ICatalogProducts[]
  onProductsUpdate: (products: ProductEntry[]) => void
  isEditing?: boolean
  updateProductsBeimLieferant: (rows: ICatalogProducts[]) => void
}) {
  function createData(id: string, name: string, ean: string, price: number, isNew: boolean) {
    return { id, name, ean, price, isNew }
  }

  interface IRow {
    id: string
    name: string
    ean: string
    price: number
    isNew: boolean
  }

  const [rows, setRows] = useState<IRow[]>(
    products?.map(row => {
      return createData(uuidv4(), row.name, row.ean, row.price, false)
    })
  )

  function updateProduct(id: string, name: string, ean: string, price: number) {
    const newRows = rows?.map(row => {
      if (row.id === id) {
        return createData(id, name, ean, price, false)
      } else {
        return row
      }
    })
    setRows(newRows)
    const catalog = newRows?.map(row => {
      return {
        name: row.name,
        ean: row.ean,
        preis: row.price
      }
    })

    const productsForLieferant = newRows?.map((row) => {
      return {
        id: row.id,
        name: row.name,
        ean: row.ean,
        price: row.price
      }
    })
    
    onProductsUpdate(catalog)
    updateProductsBeimLieferant(productsForLieferant)
    
  }

  function onAddProduct() {
    setRows([...rows, createData(uuidv4(), '', '', 0, true)])
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
                {isEditing && (
                  <TableCell align='center'>
                    <Button size='small' variant='contained' onClick={() => onAddProduct()}>
                      Produkt hinzufügen
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map(row => (
                <KatalogProdukt
                  key={'id-' + row.id}
                  id={row.id}
                  updateProduct={updateProduct}
                  name={row.name}
                  ean={row.ean}
                  price={row.price}
                  isEditing={isEditing}
                  forceEditing={row.isNew}
                />
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
  isEditing,
  forceEditing
}: {
  id: string
  name: string
  ean: string
  price: number
  updateProduct: (id: string, name: string, ean: string, price: number) => void
  isEditing?: boolean
  forceEditing?: boolean
}) {
  const [isEditing2, setIsEditing2] = useState(forceEditing?.valueOf() ?? false)

  const nameRef = useRef<any>(null)
  const EANRef = useRef<any>(null)
  const priceRef = useRef<any>(null)

  function onSave() {
    updateProduct(id, nameRef.current.value, (forceEditing)? EANRef.current.value : ean, parseFloat(priceRef.current.value))
    setIsEditing2(false)
  }

  return (
    <>
      {!isEditing2 ? (
        <TableRow key={'keyRow-' + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell component='th' scope='row'>
            <Typography>{name}</Typography>
          </TableCell>
          <TableCell align='left'>
            <Typography>{ean}</Typography>
          </TableCell>
          <TableCell align='left'>
            <Typography>{price}€</Typography>
          </TableCell>
          {isEditing && (
            <TableCell align='center'>
              <Button size='small' color='primary' variant='outlined' onClick={() => setIsEditing2(true)}>
                Bearbeiten
              </Button>
            </TableCell>
          )}
        </TableRow>
      ) : (
        <TableRow key={'keyRow-' + id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
          {forceEditing && (
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
          ) || (<TableCell align='left'>
          <Typography>{ean}</Typography>
        </TableCell>)}
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
            <Button size='small' color='success' variant='outlined' onClick={() => {onSave()}}>
              Speichern
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
