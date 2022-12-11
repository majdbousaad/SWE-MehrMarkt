import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
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
import { Ware } from 'src/lib/interfaces'


export default function VerkaufsDetailsDialog({
  isOpen,
  setIsDialogOpen,
  waren,
  deleteFromWaren,
  fetchVerkaeufe,
  deleteAllWaren,
  fetchAnzahl
}: {
  isOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  waren: Ware[]
  deleteFromWaren: (ean:string) => void
  fetchVerkaeufe: () => void,
  deleteAllWaren: () =>void,
  fetchAnzahl: () => void
}) {

  function handleClose() {
    setIsDialogOpen(false)
  }

  function verkaufen(waren: Ware[]){
    const verkauf = {
        verkaufteWaren: waren?.map((ware: Ware) => {
            return {
                lagerProdukt: ware?.product,
                menge: ware?.menge
            }
        })
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verkauf)
      }
    
      fetch('http://localhost:8080/verkauf', requestOptions).then(() => {
      
      fetchVerkaeufe()
      deleteAllWaren()
      fetchAnzahl()
    })
    setIsDialogOpen(false)

  }
  
  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Verkaufsübersicht
          </Typography>
          <Button disabled={waren?.length==0} autoFocus color='success' variant='contained' onClick={() => verkaufen(waren)} >
            verkaufen!
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
                    <TableCell align='right'>Menge</TableCell>
                    <TableCell align='right'>Löschen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {waren?.map(row => (
                    <TableRow key={row?.product?.ean}>
                      <TableCell component='th' scope='row'>
                        {row?.name}
                      </TableCell>
                      <TableCell align='right'>{row.menge}</TableCell>
                      <TableCell align='right'><IconButton 
                      color="primary" 
                      aria-label="add to shopping cart"
                      onClick={() => {deleteFromWaren(row?.product?.ean);}}
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
      </DialogContent>
    </Dialog>
  )
}
