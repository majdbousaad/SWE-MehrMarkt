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

const Dashboard = () => {
  const [anzahl, setAnzahl] = useState<{anzahl: number}>({anzahl: 0})

  useEffect(() => {
    fetchAnzahl()
  }, [])

  function fetchAnzahl(): void {
    axios
      .get('http://localhost:8080/verkauf/anzahlverkaeufe')
      .then(response => {
        const anzahlResponse = response.data as {anzahl: number}
        setAnzahl(anzahlResponse)
      })
      .catch(error => {
        alert(error)
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
          <Table />
        </Grid>
        <Grid item xs={12}>
          <LagerStatus />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
