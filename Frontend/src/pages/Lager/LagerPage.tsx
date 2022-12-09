import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table/Table'
import TableHead from '@mui/material/TableHead/TableHead'
import TableCell from '@mui/material/TableCell/TableCell'
import TableRow from '@mui/material/TableRow/TableRow'
import TableBody from '@mui/material/TableBody/TableBody'
import IconButton from '@mui/material/IconButton/IconButton'
import DeleteIcon from '@mui/icons-material/Delete';


interface ILagerProduct{
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
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }

  

  return (
    <Card>
      <CardHeader title='Lager' />
      <CardContent>
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
        </CardContent>
      </Card>
  )
}
