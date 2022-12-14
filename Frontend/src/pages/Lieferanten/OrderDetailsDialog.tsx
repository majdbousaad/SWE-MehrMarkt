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
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import {useState} from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {useSnackbar} from 'notistack'


export default function OrderDetailsDialog({
  isOpen,
  setIsDialogOpen,
  waren,
  deleteFromWaren,
  lieferant_id,
  deleteAllWaren
}: {
  isOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  waren: Ware[]
  deleteFromWaren: (ean:string) => void
  lieferant_id: number
  deleteAllWaren: () => void
}) {

  function handleClose() {
    setIsDialogOpen(false)
  }
  const {enqueueSnackbar} = useSnackbar()

  function bestellen(waren: Ware[], lieferant_id: number){
    const date = Datum?.toDate()
    date?.setHours(date.getHours() + 1)
    const bestellung = {
        lieferant: {id: lieferant_id},
        waren: waren?.map(ware =>{

          return {
            product: {ean: ware?.product?.ean},
            menge: ware.menge
          }
        }),
        vslLieferdatum: date
    }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bestellung)
      }
    
      fetch('http://localhost:8080/bestellung', requestOptions).then(response => {
      
      if(response.status == 400){
        enqueueSnackbar("Lager ist ausgelastet", {variant: 'warning'})
      } else {
        enqueueSnackbar("Bestellung ist aufgegeben", {variant: 'success'})
      }
    })
    deleteAllWaren()
    setIsDialogOpen(false)

  }

  const [Datum, setDatum] = useState<Dayjs | null>(
    dayjs(new Date())
  );

  const handleChange = (newValue: Dayjs | null) => {

    const date = newValue?.toDate() as Date
    setDatum(dayjs(date));
    console.log(Datum?.toString())
  };
  
  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Bestellübersicht
          </Typography>
          <Button disabled={waren?.length == 0} autoFocus color='success' variant='contained' onClick={() => bestellen(waren, lieferant_id)}>
            Betstellen!
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
                    <TableRow key={row.product.ean}>
                      <TableCell component='th' scope='row'>
                        {row?.name}
                      </TableCell>
                      <TableCell align='right'>{row.menge}</TableCell>
                      <TableCell align='right'><IconButton 
                      color="primary" 
                      aria-label="add to shopping cart"
                      onClick={() => {deleteFromWaren(row.product.ean);}}
                      >
                      <DeleteIcon />
                      </IconButton></TableCell>
                        
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                  label="Vsl. Lieferdatum"
                  value={Datum}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                  ampm={false}
              />
            </LocalizationProvider>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
