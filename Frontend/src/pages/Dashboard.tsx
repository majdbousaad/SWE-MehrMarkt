// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import MostPopularProducts from 'src/views/dashboard/MostPopularProducts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import TodaysSells from 'src/views/dashboard/TodaysSells'

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <MostPopularProducts />
        </Grid>
        <Grid item xs={12} md={4}>
          <TodaysSells />
        </Grid>
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
