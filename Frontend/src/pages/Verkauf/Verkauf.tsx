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
import {useSnackbar} from 'notistack'
import DoneOutlined from '@mui/icons-material/DoneOutlined';
import Tooltip from '@mui/material/Tooltip';


export default function Verkauf({fetchVerkaeufe, fetchAnzahl}:{fetchVerkaeufe: () => void, fetchAnzahl: () => void}) {
    const [lagerProducts, setLagerProducts] = useState<IOrderProductEntry[]>([])
    const [search, setSearch] = useState<string>('')
    const {enqueueSnackbar} = useSnackbar()
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
                    preis: lagerProduct.preis,
                    menge: lagerProduct.menge
                } as IOrderProductEntry
            })
          )})
        .catch(() => {
          enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})

        })
    }
  
    const [waren, setWaren] = useState<Ware[]>([])

    const [, setRefrecsh] = useState<any>({})

    const [summe, setSumme] = useState(0)
  
    function calculateSumme(){
      let sum = 0
      waren?.forEach(ware => {
        sum += ware?.menge*ware?.product?.price;
      })
      setSumme(sum)
    }
    
    useEffect(() => calculateSumme(), [waren]);

  function addToWaren(ean: string, menge: number, name:string, price: number){
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
      waren.push({product: {ean: ean, price:price}, menge: menge, name:name})

      calculateSumme()
      setRefrecsh({})
      

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
    
    calculateSumme()
  }

  function deleteAllWaren(){
    setWaren([])
    setLagerProducts(lagerProducts.map(row => {

      const s = document.getElementById(row.ean + 'verkauf') as HTMLInputElement;
       s.value = String(0);

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
            <SellDetailsButton
              fetchAnzahl={fetchAnzahl}
              deleteAllWaren={deleteAllWaren}
              fetchVerkaeufe={fetchVerkaeufe}
              waren={waren}
              deleteFromWaren={deleteFromWaren}
              summe={summe}
              fetchLagerProducts={fetchLagerProducts}
            />
          </Toolbar>
        </AppBar>
        <Card>
          <CardContent>
            <TextField
              onChange={e => setSearch(e.target.value)}
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
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table>
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
                      <TableCell>
                        {lagerProduct.name}{' '}
                        {waren?.findIndex(ware => lagerProduct.ean == ware.product.ean) > -1 && (
                          <span>
                            <IconButton>
                              <DoneOutlined />
                            </IconButton>
                          </span>
                        )}{' '}
                      </TableCell>
                      <TableCell>
                        <div className='w-full flex gap-4 items-center'>
                          <TextField
                            defaultValue={0}
                            id={lagerProduct.ean + 'verkauf'}
                            type='number'
                            InputLabelProps={{
                              shrink: true
                            }}
                            style={{ width: 75 }}
                            InputProps={{ inputProps: { min: 0, max: lagerProduct.menge } }}
                            onChange={e => {
                              if (Number(e.target.value) > lagerProduct.menge) {
                                enqueueSnackbar(
                                  'Es gibt nur ' + lagerProduct.menge + ' Stück ' + lagerProduct.name + ' im Lager',
                                  { variant: 'info' }
                                )
                                lagerProduct.amount = lagerProduct.menge
                                const s = document.getElementById(lagerProduct.ean + 'verkauf') as HTMLInputElement

                                s.value = String(lagerProduct.menge)
                              } else if (Number(e.target.value) < 0) {
                                alert('Die Menge soll positiv sein')
                                lagerProduct.amount = 0
                                const s = document.getElementById(lagerProduct.ean + 'verkauf') as HTMLInputElement

                                s.value = '0'
                              }
                              lagerProduct.amount = Number(e.target.value)
                            }}
                          />
                          <Typography variant='body2'>/ {lagerProduct.menge}</Typography>
                        </div>
                      </TableCell>
                      <TableCell>
                      <Tooltip title='Zum Warenkorb hinzufügen'>

                        <IconButton
                          color='primary'
                          aria-label='add to shopping cart'
                          onClick={() =>
                            addToWaren(lagerProduct.ean, lagerProduct.amount, lagerProduct.name, lagerProduct.preis)
                          }
                        >
                          <ShoppingCartCheckoutIcon />
                        </IconButton>
                        </Tooltip>
                        <Tooltip title='Vom Warenkorb löschen und Menge auf 0 setzen'>

                        <IconButton
                          color='primary'
                          aria-label='add to shopping cart'
                          onClick={() => deleteFromWaren(lagerProduct.ean)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        </Tooltip>
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
    fetchAnzahl,
    summe,
    fetchLagerProducts
  }: 
  { 
    waren: Ware[], 
    deleteFromWaren: (ean: string) => void
    fetchVerkaeufe: () => void
    deleteAllWaren: () => void
    fetchAnzahl: () => void
    summe: number
    fetchLagerProducts: (search:string) => void
  }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
  
    return (
      <>
        <Button autoFocus color='success' variant='contained' onClick={() => setIsDialogOpen(true)}>
              Zur Verkaufsübersicht
            </Button>
        <VerkaufsDetailsDialog  fetchLagerProducts={fetchLagerProducts} fetchAnzahl={fetchAnzahl} deleteAllWaren={deleteAllWaren} fetchVerkaeufe={fetchVerkaeufe} isOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} waren={waren} deleteFromWaren={deleteFromWaren} summe={summe}/>
      </>
    )
  }
