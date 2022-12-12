// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useState, useEffect } from 'react'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import LagerStatus from 'src/views/dashboard/LagerStatus'
import MostPopularProducts from 'src/views/dashboard/MostPopularProducts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import TodaysSells from 'src/views/dashboard/TodaysSells'
import {useSnackbar} from 'notistack'


export interface ILagerStatistik{
  name: string,
  data: number
}

const Dashboard = () => {
  const [anzahl, setAnzahl] = useState<{anzahl: number}>({anzahl: 0})
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAnzahl()
    fetchStatistik()
  }, [])

  function fetchAnzahl(): void {
    axios
      .get('http://localhost:8080/verkauf/anzahlverkaeufe')
      .then(response => {
        const anzahlResponse = response.data as {anzahl: number}
        setAnzahl(anzahlResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})
      })
  }

  const [statistik, setStatistik] = useState<ILagerStatistik[]>([])



   function fetchStatistik() {
     axios
      .get('http://localhost:8080/lager/statistik')
      .then(response => {
        const statistikResponse = response.data as ILagerStatistik[]
        setStatistik(statistikResponse)
      })
      .catch(() => {
        enqueueSnackbar('Es gibt keine Verbindung zur Datenbank', {variant: 'error'})

      })
  }
  
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <MostPopularProducts />
        </Grid>
        <Grid item xs={12} md={4}>
          <TodaysSells data={anzahl}/>
        </Grid>
        <Grid item xs={12}>
          <Table fetchStatistik={fetchStatistik} />
        </Grid>
        <Grid item xs={12}>
          <LagerStatus statistik={statistik}/>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
