import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface IBeliebtesProdukt{
  name: string,
  verkaeufe: number,
  verbleibend: number
}
export default function MostPopularProducts() {
  function createData(name: string, sold: number, stored: number) {
    return { name, sold, stored }
  }

  const [beliebsteLagerProducts, setBeliebsteLagerProducts] = useState<IBeliebtesProdukt[]>([])

  useEffect(() => {
    fetchBeliebsteLagerProducts()
  }, [])

  function fetchBeliebsteLagerProducts(): void {
    axios
      .get('http://localhost:8080/verkauf/beliebsteProdukte')
      .then(response => {
        const beliebsteLagerProductsResponse = response.data as IBeliebtesProdukt[]
        setBeliebsteLagerProducts(beliebsteLagerProductsResponse)
      })
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }



  const rows = [
    createData('Frozen yoghurt', 159, 200),
    createData('Ice cream sandwich', 237, 20),
    createData('Eclair', 262, 160),
    createData('Cupcake', 305, 37),
    createData('Gingerbread', 356, 98)
  ]

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Beliebteste Produkte</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Produktbezeichnung</TableCell>
                <TableCell align='right'>Absatz</TableCell>
                <TableCell align='right'>Restlicher Lagerbestand(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beliebsteLagerProducts?.map(row => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.verkaeufe}</TableCell>
                  <TableCell align='right'>{row.verbleibend}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
