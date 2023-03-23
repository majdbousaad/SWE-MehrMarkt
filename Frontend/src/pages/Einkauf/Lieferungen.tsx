import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import { ILieferungAll } from './EinkaufPage'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone'
import { TableContainer, Tooltip } from '@mui/material'
import EinkaufSummary, { IEinkaufOne } from './EinkaufSummary'
import { useState } from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { formatDate } from 'src/lib/functions'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InfoOutlined from '@mui/icons-material/InfoOutlined'

export default function Lieferungen({
  lieferungen,
  arrived,
  orderArrived,
  orderCanceled
}: {
  lieferungen: ILieferungAll[]
  arrived: boolean
  orderArrived?: (lieferung_id: number) => void
  orderCanceled?: (lieferung_id: number) => void
}) {
  async function fetchEinkauf(einkauf_id: number) {
    await axios
      .get('http://localhost:8080/bestellung/' + einkauf_id)
      .then(response => {
        const einkaufResponse = response.data as IEinkaufOne
        setEinkauf(einkaufResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
      })
  }

  const [einkauf, setEinkauf] = useState<IEinkaufOne>()
  const [einkaufDialogOpen, setEinkaufDialogOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  function onEinkaufDialogClose() {
    setEinkaufDialogOpen(false)
  }
  async function onEinkaufDialogOpen(einkauf_id: number) {
    await fetchEinkauf(einkauf_id)

    setEinkaufDialogOpen(true)
  }

  if (!lieferungen) {
    return <></>
  } else if (!lieferungen.length) {
    return <></>
  }

  return (
    <>
      <Card>
        <CardHeader title={arrived ? 'Gelieferte Bestellungen' : 'Ausstehende Lieferungen'} />
        <CardContent>
          <TableContainer sx={{ maxHeight: 300 }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Lieferungsnummer</TableCell>
                  <TableCell>Lieferant</TableCell>
                  <TableCell>{arrived ? 'Lieferdatum' : 'Vsl. Lieferdatum'}</TableCell>
                  <TableCell>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lieferungen?.map((lieferung: ILieferungAll) => (
                  <TableRow hover key={lieferung.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                          {lieferung.id}
                        </Typography>
                        <Tooltip title='Detailansicht dieser Bestellung'>
                          <IconButton
                            color='primary'
                            size='small'
                            sx={{ p: 0, marginLeft: 1 }}
                            onClick={() => onEinkaufDialogOpen(lieferung.id)}
                          >
                            <InfoOutlined fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>{lieferung.lieferant}</TableCell>
                    <TableCell>
                      {arrived ? formatDate(new Date(lieferung.tats)) : formatDate(new Date(lieferung.vsl))}
                    </TableCell>
                    <TableCell>
                      {!arrived && (
                        <>
                          <Tooltip title='Diese Bestellung is angekommen'>
                            <IconButton
                              color='primary'
                              onClick={() => {
                                if (orderArrived) orderArrived(lieferung.id)
                              }}
                            >
                              <DownloadDoneIcon />
                            </IconButton>
                          </Tooltip>
                          {orderCanceled && (
                            <Tooltip title='Diese Bestellung stornieren'>
                              <IconButton
                                color='primary'
                                onClick={() => {
                                  if (orderCanceled) orderCanceled(lieferung.id)
                                }}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {einkauf && (
        <EinkaufSummary
          handleClose={onEinkaufDialogClose}
          open={einkaufDialogOpen}
          einkauf={einkauf}
          arrived={arrived}
        />
      )}
    </>
  )
}
