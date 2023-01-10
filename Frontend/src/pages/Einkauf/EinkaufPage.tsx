import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {CardHeader} from '@mui/material'
import Lieferungen from './Lieferungen'
import {useSnackbar} from  'notistack'
import ConfirmDialog from 'src/components/ConfirmDialog'

export interface ILieferungAll {
  tats: string
  id: number
  lieferant: string
  vsl: string
}

export default function EinkaufPage() {
  const [anstehendeLiefererungen, setAnstehendeLiefererungen] = useState<ILieferungAll[]>([])
  const [gelieferteLiefererungen, setGelieferteLiefererungen] = useState<ILieferungAll[]>([])
  const { enqueueSnackbar } = useSnackbar()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmDialogOrderId, setConfirmDialogOrderId] = useState(0)

  useEffect(() => {
    fetchAnstehendeLiefererungen()
    fetchGelieferteLiefererungen()
  }, [])

  function fetchAnstehendeLiefererungen(): void {
    axios
      .get('http://localhost:8080/bestellung/anstehend')
      .then(response => {
        const anstehendeLiefererungenResponse = response.data as ILieferungAll[]
        setAnstehendeLiefererungen(anstehendeLiefererungenResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
      })
  }

  function fetchGelieferteLiefererungen(): void {
    axios
      .get('http://localhost:8080/bestellung/geliefert')
      .then(response => {
        const gelieferteLiefererungenResponse = response.data as ILieferungAll[]
        setGelieferteLiefererungen(gelieferteLiefererungenResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
      })
  }

  function orderArrived(orderId: number) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ angekommen: true })
    }
    fetch('http://localhost:8080/bestellung/' + orderId, requestOptions)
      .then(() => {
        fetchAnstehendeLiefererungen()
        fetchGelieferteLiefererungen()
        enqueueSnackbar('Bestellung mit Nummer ' + orderId + ' wurde als zugestellt markiert', { variant: 'success' })
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', { variant: 'error' })
      })
  }

  function onOrderCancel(id: number): void {
    setConfirmDialogOrderId(id)
    setIsConfirmDialogOpen(true)
  }

  function cancelOrder(): void {
    axios
      .delete(`http://localhost:8080/bestellung/${confirmDialogOrderId}`)
      .then(() => {
        enqueueSnackbar('Bestellung wurde storniert', { variant: 'success' })
        fetchAnstehendeLiefererungen()
        fetchGelieferteLiefererungen()
        setIsConfirmDialogOpen(false)
      })
      .catch(() => {
        enqueueSnackbar('Ein fehler ist aufgetreten', { variant: 'error' })
      })
  }

  return (
    <>
      <Card>
        <CardHeader title='Einkauf' />
        <CardContent>
          <Lieferungen
            lieferungen={anstehendeLiefererungen}
            orderArrived={orderArrived}
            arrived={false}
            orderCanceled={onOrderCancel}
          />
          <Lieferungen lieferungen={gelieferteLiefererungen} arrived={true} />
          <ConfirmDialog
            onConfirm={() => cancelOrder()}
            content={`Wollen Sie die Bestellung ${confirmDialogOrderId} wirklich stornieren?`}
            open={isConfirmDialogOpen}
            onDecline={() => setIsConfirmDialogOpen(false)}
            title={`Bestellung ${confirmDialogOrderId} stornieren`}
          />
        </CardContent>
      </Card>
    </>
  )
}

