import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from 'mdi-material-ui/Close'
import DialogContent from '@mui/material/DialogContent'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@mui/material'
import { IOrderProductEntry, Ware } from 'src/lib/interfaces'
import { OrderDetailsDialog } from './OrderDetailsDialog'

export function PlaceOrderDialog({
  isOpen,
  setIsDialogOpen,
  id
}: {
  isOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  id: number
}) {
  function handleClose() {
    setIsDialogOpen(false)
  }

  function createData(
    name: string,
    ean: string,
    price: number,
    amount: number
  ): { name: string; ean: string; price: number; amount: number } {
    return { name, ean, price, amount }
  }
  async function fetchProducts(id: number) {
    await axios
      .get('http://localhost:8080/lieferant/' + id + '/products')
      .then(response => {
        //TODO: Delete this console.log when done
        console.log(response)
        const products = response.data as IOrderProductEntry[]
        setRows(products)
      })
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }
  //const rows: IOrderProductEntry[] = [createData('Cupcake', '313123', 3.7, 0), createData('Brot', '1432135', 1.42, 0)]

  const [rows, setRows] = useState<IOrderProductEntry[]>([])
  useEffect(()=>{
    fetchProducts(id)
  }, [])
  interface IOrderProductEntry {
    name: string
    ean: string
    price: number
    amount: number
  }


  const [waren, setWaren] = useState<Ware[]>([])

  function addToWaren(ean: string, menge: number){
    if(menge == 0){
      return
    }
    let exists = false;
    for(let i = 0; i < waren.length; i++){
      if(waren[i].product.ean == ean){
        exists = true;
        waren[i].menge = menge;
      }
    }
    if(!exists)
      waren.push({product: {ean: ean}, menge: menge})
    console.log(waren)
  }

  function deleteFromWaren(ean: string){
    for(let i = 0; i < waren.length; i++){
      if(waren[i].product.ean == ean){
        waren.splice(i, 1);
        
      }
    }

    setRows(rows.map(row => {
      
      if(row.ean === ean){
        return {...row, amount: 0}
      }
      return row
    }));

    var s = document.getElementById(ean) as HTMLInputElement;
    s.value = String(0);
    

  }
  
  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Bestellung aufgeben
          </Typography>
          <OrderDetailsButton waren={waren} rows={rows} deleteFromWaren={deleteFromWaren} lieferant_id={id} />
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Card>
          <CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Produktbezeichnung</TableCell>
                    <TableCell align='right'>Preis</TableCell>
                    <TableCell align='right'>Menge</TableCell>
                    <TableCell align='right'>Zum Warenkorb hinzufügen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.ean}>
                      <TableCell component='th' scope='row'>
                        {row.name}
                      </TableCell>
                      <TableCell align='right'>{row.price}</TableCell>
                      <TableCell align='right'>
                        <TextField
                          id = {row.ean}
                          size='small'
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          defaultValue={row.amount}
                          onChange={(e) => row.amount = Number(e.target.value)}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Button variant='outlined' onClick={() => addToWaren(row.ean,row.amount)}>BESTELLEN</Button>
                        <Button variant='outlined' onClick={() => {deleteFromWaren(row.ean);}}>Löschen</Button>
                      </TableCell>
                        
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

function OrderDetailsButton({ 
  waren, 
  rows, deleteFromWaren, 
  lieferant_id 
}: 
{ 
  waren: Ware[], 
  rows: IOrderProductEntry[], 
  deleteFromWaren: (ean: string) => void
  lieferant_id: number
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button autoFocus color='success' variant='contained' onClick={() => setIsDialogOpen(true)}>
            Zur Bestellübersicht
          </Button>
      <OrderDetailsDialog isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} waren={waren} rows={rows}  deleteFromWaren={deleteFromWaren} lieferant_id={lieferant_id}/>
    </>
  )
}
