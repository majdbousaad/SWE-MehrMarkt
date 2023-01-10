import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import VerkaufSummary, { IVerkaufOne } from './VerkaufSummary'
import { useSnackbar } from 'notistack'
import { formatDate } from 'src/lib/functions'
import Information from 'mdi-material-ui/Information'

export interface IVerkaufAll {
  Datum: string
  id: number
  gesamtPreis: number
}

export default function Verkaufsverlauf({
  verkaeufe,
  fetchVerkaeufe
}: {
  verkaeufe: IVerkaufAll[]
  fetchVerkaeufe: () => void
}) {
  useEffect(() => {
    fetchVerkaeufe()
  }, [])

  const [verkaufDialogOpen, setVerkaufDialogOpen] = useState(false)
  const [verkauf, setVerkauf] = useState<IVerkaufOne>()
  const { enqueueSnackbar } = useSnackbar()
  function onVerkaufDialogClose() {
    setVerkaufDialogOpen(false)
  }

  async function fetchVerkauf(verkauf_id: number) {
    await axios
      .get('http://localhost:8080/verkauf/' + verkauf_id)
      .then(response => {
        const verkaufResponse = response.data as IVerkaufOne
        setVerkauf(verkaufResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
      })
  }

  async function onVerkaufDialogOpen(verkauf_id: number) {
    await fetchVerkauf(verkauf_id)

    setVerkaufDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader title='Verkaufsverlauf' />
        <CardContent>
          <TableContainer sx={{ maxHeight: 200 }} component={Paper}>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Datum</TableCell>
                  <TableCell>Warenkorb-ID</TableCell>
                  <TableCell>Gesamtpreis</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verkaeufe?.map((verkauf: IVerkaufAll) => (
                  <TableRow hover key={verkauf.id}>
                    <TableCell>{formatDate(new Date(verkauf.Datum))}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{verkauf.id}</Typography>
                        <IconButton
                          color='primary'
                          size='small'
                          sx={{ p: 0, marginLeft: 1 }}
                          onClick={() => onVerkaufDialogOpen(verkauf.id)}
                        >
                          <Information fontSize='small' />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{verkauf.gesamtPreis}€</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {verkauf && <VerkaufSummary handleClose={onVerkaufDialogClose} open={verkaufDialogOpen} verkauf={verkauf} />}
    </>
  )
}
