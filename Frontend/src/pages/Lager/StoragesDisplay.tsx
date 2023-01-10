import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
  AppBar,
  Box,
  Button,
  CardHeader,
  Dialog,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close'

interface ILager {
  standard: boolean
  size: number
  max: number
  name: string
}

export function StoragesDisplay() {
  const [storages, setStorages] = useState<ILager[]>([])

  useEffect(() => {
    fetchStorages()
  }, [])

  function fetchStorages() {
    axios.get('http://localhost:8080/lager/namen').then(response => {
      const data = response.data as ILager[]
      setStorages(data)
    })
  }

  return (
    <Card className='mt-4'>
      <CardHeader title='Übersicht aller Lager' />
      <CardContent>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table className='w-full'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Auslastung</TableCell>
                <TableCell>Maximale Auslastung</TableCell>
                <TableCell align='center'>Detailansicht</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storages.map(storage => (
                <TableRow hover key={storage.name + 'id'}>
                  <TableCell>{storage.name}</TableCell>
                  <TableCell>{storage.size}</TableCell>
                  <TableCell>{storage.max}</TableCell>
                  <TableCell align='center'>
                    <StorageDetailButton lager={storage} fetchStorages={fetchStorages} />
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

function StorageDetailButton({ lager, fetchStorages }: { lager: ILager; fetchStorages: () => void }) {
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  function onSubmit(newLagerSize: number): void {
    axios
      .patch(`http://localhost:8080/lager/updateSize/${lager.name}/${newLagerSize}`)
      .then(response => {
        enqueueSnackbar('Änderungen gespeichert', { variant: 'success' })
        fetchStorages()
        setOpen(false)
      })
      .catch(error => {
        enqueueSnackbar('Änderungen konnten nicht gespeichert werden', { variant: 'error' })
        setOpen(false)
      })
  }

  function handleAbort() {
    setOpen(false)
  }

  return (
    <>
      <Button variant='outlined' color='info' onClick={() => setOpen(true)}>
        Details
      </Button>
      <StorageDetailDialog open={open} onSubmit={onSubmit} lager={lager} handleAbort={handleAbort} />
    </>
  )
}

function StorageDetailDialog({
  open,
  onSubmit,
  handleAbort,
  lager
}: {
  open: boolean
  onSubmit: (neueAuslastung: number) => void
  handleAbort: () => void
  lager: ILager
}) {
  const [newLagerMaxSize, setNewLagerMaxSize] = useState(lager.max)

  function handleSubmit() {
    onSubmit(newLagerMaxSize)
  }

  return (
    <>
      <Dialog maxWidth='xl' open={open} onClose={handleAbort}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleAbort} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <div className='flex flex-row gap-2 w-full'>
              <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                Produkt Detailansicht
              </Typography>
              <Button color='success' variant='contained' onClick={handleSubmit}>
                Änderungen speichern
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Grid container>
            <TextField className='w-full' style={{ marginTop: 12 }} defaultValue={lager.name} label='Name' disabled />
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              defaultValue={lager.size}
              label='Auslastung'
              disabled
            />
            <TextField
              className='w-full'
              style={{ marginTop: 12 }}
              defaultValue={lager.max}
              label='Maximale Auslastung'
              type={'number'}
              onChange={(event: any) => setNewLagerMaxSize(event.target.value as number)}
            />
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}
