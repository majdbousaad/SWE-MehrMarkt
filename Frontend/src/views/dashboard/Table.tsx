import axios from 'axios'
import { ILieferungAll } from 'src/pages/Einkauf/EinkaufPage'
import { useEffect, useState } from 'react'
import Lieferungen from 'src/pages/Einkauf/Lieferungen'
import {useSnackbar} from 'notistack'



const DashboardTable = ({fetchStatistik}:{fetchStatistik: () => void}) => {

  const [anstehendeLiefererungen, setAnstehendeLiefererungen] = useState<ILieferungAll[]>([])
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAnstehendeLiefererungen()
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

  function orderArrived(orderId: number){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({angekommen:true})
    }
    fetch('http://localhost:8080/bestellung/' + orderId, requestOptions).then(() => {
      fetchAnstehendeLiefererungen()
      fetchStatistik()
      enqueueSnackbar('Bestellung mit Nummer ' + orderId + ' wurde als zugestellt markiert', {variant:'success'})
    }).catch(() => {
      enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})
    })
  }
  
return(
  <Lieferungen lieferungen={anstehendeLiefererungen} arrived={false} orderArrived={orderArrived}/>
)
}

export default DashboardTable
