import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { CardHeader, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'



export interface ILagerProduct{
  name: string,
  menge: number,
  lagerort: string,
  preis: string,
  ean: string

}

export default function LagerPage() {
  const [lagerProducts, setLagerProducts] = useState<ILagerProduct[]>([])

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
        alert('Es gibt keine Verbindung zur Datenbank')
      })
  }

  

  return (
    <Card>
      <CardHeader title='Lager' />
      <CardContent>
        <TableContainer sx={{maxHeight: 400}}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Menge</TableCell>
                <TableCell>Lagerort</TableCell>
                <TableCell>Preis</TableCell>
                <TableCell>Löschen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lagerProducts?.map((lagerProduct: ILagerProduct) => (
                <TableRow hover key={lagerProduct.ean}>
                  <TableCell>{lagerProduct.name}</TableCell>
                  <TableCell>{lagerProduct.menge}</TableCell>
                  <TableCell>{lagerProduct.lagerort}</TableCell>
                  <TableCell>{lagerProduct.preis}</TableCell>
                  <TableCell><IconButton 
                        color="primary" 
                        aria-label="add to shopping cart"
                        
                        //onClick={() => orderArrived(anstehendeLiefererung.id)}
                        >
                        <DeleteIcon />
                        </IconButton></TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </CardContent>
      </Card>
  )
}
