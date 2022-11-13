// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// ** Types Imports
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

function createData(orderId: string, supplier: string, deliveryDate: string) {
  return { orderId, supplier, deliveryDate }
}

const rows = [
  createData('0001', 'Frank Schmidt', '12.12.2022'),
  createData('0002', 'Peter Bauer', '12.12.2022'),
  createData('0003', 'Jürgen Heinrichs', '13.12.2022')
]

const DashboardTable = () => {
  return (
    <Card>
      <CardHeader title='Anstehende Lieferungen' />
      <CardContent>
        <TableContainer>
          <Table size='small' sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>LieferId</TableCell>
                <TableCell align='right'>Lieferant</TableCell>
                <TableCell align='right'>Voraussichtliches Lieferdatum</TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow hover key={row.orderId} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell align='right'>{row.supplier}</TableCell>
                  <TableCell align='right'>{row.deliveryDate}</TableCell>
                  <TableCell align='center'>
                    <Button variant='text'>Mehr Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default DashboardTable
