import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { IOrderProductEntry, Ware } from 'src/lib/interfaces'
import  OrderDetailsDialog  from './OrderDetailsDialog'

export default function PlaceOrderDialog({
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

  const [rows, setRows] = useState<IOrderProductEntry[]>([])
  useEffect(()=>{
    fetchProducts(id)
  }, [id])

  interface IOrderProductEntry {
    name: string
    ean: string
    price: number
    amount: number
  }


  const [waren, setWaren] = useState<Ware[]>([])

  function addToWaren(ean: string, menge: number, name:string){
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
      waren.push({product: {ean: ean}, menge: menge, name:name})
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

    const s = document.getElementById(ean + 'bestellung') as HTMLInputElement;
    s.value = String(0);
    

  }

  function deleteAllWaren(){
    setWaren([])
    setRows(rows?.map(row => {

        return {...row, amount: 0}
  
      }));

    rows?.map(row =>{
      const s = document.getElementById(row?.ean + 'bestellung') as HTMLInputElement;
    s.value = String(0);
    })
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
          <OrderDetailsButton deleteAllWaren={deleteAllWaren} waren={waren} rows={rows} deleteFromWaren={deleteFromWaren} lieferant_id={id} />
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
                          id={row.ean + 'bestellung'}
                          type="number"
                          InputLabelProps={{
                              shrink: true,
                          }}
                          onChange={(e) => row.amount = Number(e.target.value)}
                          defaultValue={0}
                      />
                      </TableCell>
                      <TableCell align='right'>
                      <IconButton 
                      color="primary" 
                      aria-label="add to shopping cart"
                      onClick={() => addToWaren(row.ean,row.amount, row.name)}
                      >
                      
                      <ShoppingCartCheckoutIcon />
                      </IconButton>

                      <IconButton 
                      color="primary" 
                      aria-label="add to shopping cart"
                      onClick={() => {deleteFromWaren(row.ean);}}
                      >
                      <DeleteIcon />
                      </IconButton>
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
  lieferant_id,
  deleteAllWaren
}: 
{ 
  waren: Ware[], 
  rows: IOrderProductEntry[], 
  deleteFromWaren: (ean: string) => void
  lieferant_id: number
  deleteAllWaren: () => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button autoFocus color='success' variant='contained' onClick={() => setIsDialogOpen(true)}>
            Zur Bestellübersicht
          </Button>
      <OrderDetailsDialog deleteAllWaren={deleteAllWaren} isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} waren={waren} rows={rows}  deleteFromWaren={deleteFromWaren} lieferant_id={lieferant_id}/>
    </>
  )
}
