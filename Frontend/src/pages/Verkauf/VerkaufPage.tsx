import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Grid from '@mui/material/Grid'
import TodaysSells from 'src/views/dashboard/TodaysSells'
import Verkaufsverlauf, { IVerkaufAll } from './Verkaufsverlauf'
import Verkauf from './Verkauf'
import axios from 'axios'
import { useState, useEffect } from 'react'

export default function VerkaufPage() {

  const [verkaeufe, setVerkaeufe] = useState<IVerkaufAll[]>([])

  function fetchVerkaeufe(): void {
    axios
      .get('http://localhost:8080/verkauf')
      .then(response => {
        const verkaeufeResponse = response.data as IVerkaufAll[]
        setVerkaeufe(verkaeufeResponse)
      })
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }

  const [anzahl, setAnzahl] = useState<{anzahl: number}>({anzahl: 0})

  useEffect(() => {
    fetchAnzahl()
    fetchVerkaeufe()
  }, [])

  function fetchAnzahl(): void {
    axios
      .get('http://localhost:8080/verkauf/anzahlverkaeufe')
      .then(response => {
        const anzahlResponse = response.data as {anzahl: number}
        setAnzahl(anzahlResponse)
      })
      .catch(error => {
        console.log('missing error handling')
        console.log(error)
      })
  }

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <Verkauf fetchVerkaeufe={fetchVerkaeufe} fetchAnzahl={fetchAnzahl}/>
        </Grid>
        <Grid item xs={12} md={8}>
            <Verkaufsverlauf verkaeufe={verkaeufe} fetchVerkaeufe={fetchVerkaeufe}/>
        </Grid>
        <Grid item xs={12} md={4}>
            <TodaysSells data={anzahl}/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}
