import { useEffect, useState } from 'react'
import axios from 'axios'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import { IOrderProductEntry, Ware } from 'src/lib/interfaces'
import Button from '@mui/material/Button'
import VerkaufsDetailsDialog from './VerkaufsDetailsDialog'
import { Typography, AppBar,Toolbar, Card, CardContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow , TextField} from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment';
import Magnify from 'mdi-material-ui/Magnify';
import TableContainer from '@mui/material/TableContainer';



export default function Verkauf({fetchVerkaeufe, fetchAnzahl}:{fetchVerkaeufe: () => void, fetchAnzahl: () => void}) {
    const [lagerProducts, setLagerProducts] = useState<IOrderProductEntry[]>([])
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
      fetchLagerProducts(search)
    }, [search])
  
    function fetchLagerProducts(search:string): void {
      axios
        .get('http://localhost:8080/lagerprodukt/search?text=' + search)
        .then(response => {
          const lagerProductsResponse = response.data as IOrderProductEntry[]
          setLagerProducts(lagerProductsResponse?.map(lagerProduct => {
                return {
                    amount:0,
                    ean: lagerProduct.ean,
                    name: lagerProduct.name,
                    price: lagerProduct.price
                } as IOrderProductEntry
            })
          )})
        .catch(() => {
          alert('Es gibt keine Verbindung zur Datenbank')

        })
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
  }

  function deleteFromWaren(ean: string){
    for(let i = 0; i < waren.length; i++){
      if(waren[i].product.ean == ean){
        waren.splice(i, 1);
        break;
        
      }
    }
    setLagerProducts(lagerProducts.map(row => {
      
        if(row.ean === ean){
  
          return {...row, amount: 0}
        }
  
        return row
      }));
    const s = document.getElementById(ean + 'verkauf') as HTMLInputElement;
    s.value = String(0);
    

  }

  function deleteAllWaren(){
    setWaren([])
    setLagerProducts(lagerProducts.map(row => {

        return {...row, amount: 0}
  
      }));
  }
  
    return (
        <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Verkauf
          </Typography>
          <SellDetailsButton fetchAnzahl={fetchAnzahl} deleteAllWaren={deleteAllWaren} fetchVerkaeufe={fetchVerkaeufe} waren={waren} deleteFromWaren={deleteFromWaren}/>
        </Toolbar>
      </AppBar>
      <Card>
        <CardContent>
        <TextField
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        />
        <TableContainer sx={{maxHeight: 500}}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Produkt EAN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Menge</TableCell>
                <TableCell>Funktion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lagerProducts?.map((lagerProduct: IOrderProductEntry) => (
                <TableRow hover key={lagerProduct.ean}>
                  <TableCell>{lagerProduct.ean}</TableCell>
                  <TableCell>{lagerProduct.name}</TableCell>
                  <TableCell>
                    <TextField
                        id={lagerProduct.ean + 'verkauf'}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => lagerProduct.amount = Number(e.target.value)}
                        defaultValue={0}
                    />

                  </TableCell>
                  <TableCell>
                    <IconButton 
                        color="primary" 
                        aria-label="add to shopping cart"
                        
                        onClick={() => addToWaren(lagerProduct.ean, lagerProduct.amount, lagerProduct.name)}
                        >
                        <ShoppingCartCheckoutIcon />
                    </IconButton>
                    <IconButton 
                        color="primary" 
                        aria-label="add to shopping cart"
                        
                        onClick={() => deleteFromWaren(lagerProduct.ean)}
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
        </>
    )
  }

  function SellDetailsButton({ 
    waren, 
    deleteFromWaren,
    fetchVerkaeufe,
    deleteAllWaren,
    fetchAnzahl
  }: 
  { 
    waren: Ware[], 
    deleteFromWaren: (ean: string) => void
    fetchVerkaeufe: () => void
    deleteAllWaren: () => void
    fetchAnzahl: () => void
  }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
  
    return (
      <>
        <Button autoFocus color='success' variant='contained' onClick={() => setIsDialogOpen(true)}>
              Zur Verkaufsübersicht
            </Button>
        <VerkaufsDetailsDialog fetchAnzahl={fetchAnzahl} deleteAllWaren={deleteAllWaren} fetchVerkaeufe={fetchVerkaeufe} isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} waren={waren} deleteFromWaren={deleteFromWaren}/>
      </>
    )
  }
