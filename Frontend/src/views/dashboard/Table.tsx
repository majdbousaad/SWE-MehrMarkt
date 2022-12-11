import axios from 'axios'
import { ILieferungAll } from 'src/pages/Einkauf/EinkaufPage'
import { useEffect, useState } from 'react'
import Lieferungen from 'src/pages/Einkauf/Lieferungen'

function createData(orderId: string, supplier: string, deliveryDate: string) {
  return { orderId, supplier, deliveryDate }
}


const DashboardTable = () => {

  const [anstehendeLiefererungen, setAnstehendeLiefererungen] = useState<ILieferungAll[]>([])

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
        alert('Es gibt keine Verbindung zur Datenbank')

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
    })
  }
  
return(
  <Lieferungen lieferungen={anstehendeLiefererungen} arrived={false} orderArrived={orderArrived}/>
)
}

export default DashboardTable
