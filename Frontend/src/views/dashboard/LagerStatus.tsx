import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'

export default function LagerStatus() {
  const series = [
    {
      name: 'Lagerauslastung',
      data: [331, 200, 44]
    }
  ]

  const options: ApexOptions = {
    chart: {
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top' // top, center, bottom
        }
      }
    },

    dataLabels: {
      enabled: true
    },
    legend: { show: true },

    xaxis: {
      categories: ['Lager A', 'Lager B', 'Lager C']
    }
  }

  return (
    <Card className='h-full w-full p-2 bg-red-600'>
      <CardHeader title='Lagerstatus' />
      <CardContent>
        <ReactApexcharts options={options} series={series} type='bar' height={350} />
      </CardContent>
    </Card>
  )
}
