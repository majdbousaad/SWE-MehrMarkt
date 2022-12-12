import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {CardHeader} from '@mui/material'
import Lieferungen from './Lieferungen'
import {useSnackbar} from  'notistack'

export interface ILieferungAll{
  tats: string,
  id: number,
  lieferant: string,
  vsl: string

}

export default function EinkaufPage() {
  const [anstehendeLiefererungen, setAnstehendeLiefererungen] = useState<ILieferungAll[]>([])
  const [gelieferteLiefererungen, setGelieferteLiefererungen] = useState<ILieferungAll[]>([])
  const {enqueueSnackbar} = useSnackbar()
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
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})
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
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})

      })
  }

  function orderArrived(orderId: number){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({angekommen:true})
    }
    fetch('http://localhost:8080/bestellung/' + orderId, requestOptions).then(() => {
      fetchAnstehendeLiefererungen()
      fetchGelieferteLiefererungen()
    }) .catch(() => {
      enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})
    })
  }

  return (
    <>

    <Card>
    <CardHeader title='Einkauf' />
      <CardContent>
        <Lieferungen lieferungen={anstehendeLiefererungen} orderArrived={orderArrived} arrived={false}/>
        <Lieferungen lieferungen={gelieferteLiefererungen} orderArrived={() =>void 0} arrived={true}/>
      </CardContent>
    </Card>
    </>
  )
}

