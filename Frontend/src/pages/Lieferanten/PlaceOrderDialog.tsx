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

export function PlaceOrderDialog({
  isOpen,
  setIsDialogOpen
}: {
  isOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
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

  const rows: IOrderProductEntry[] = [createData('Cupcake', '313123', 3.7, 0), createData('Brot', '1432135', 1.42, 0)]

  interface IOrderProductEntry {
    name: string
    ean: string
    price: number
    amount: number
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
          <Button autoFocus color='success' variant='contained'>
            Zur Bestellübersicht
          </Button>
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
                    <TableRow key={row.name}>
                      <TableCell component='th' scope='row'>
                        {row.name}
                      </TableCell>
                      <TableCell align='right'>{row.price}</TableCell>
                      <TableCell align='right'>
                        <TextField
                          size='small'
                          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                          defaultValue={row.amount}
                        />
                      </TableCell>
                      <TableCell align='right'>
                        <Button variant='outlined'>BESTELLEN</Button>
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
