import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'

export default function LagerStatus() {
  const theme = useTheme()

  const series = [44, 55, 70]

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px'
          },
          value: {
            fontSize: '16px'
          },
          total: {
            show: true,
            label: 'Gesamtauslastung',
            formatter: function () {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              const sum = series.reduce((a, b) => {
                return a + b
              }, 0)

              console.log(sum)
              return ((sum / (series.length * 100)) * 100).toFixed(2) + '%'
            }
          }
        }
      }
    },
    labels: ['Lager A', 'Lager B', 'Lager C'],
    legend: { show: true }
  }

  return (
    <Card className='h-full w-full p-2 bg-red-600'>
      <CardHeader title='Anstehende Lieferungen' />
      <CardContent>
        <ReactApexcharts options={options} series={series} type='radialBar' height={350} />
      </CardContent>
    </Card>
  )
}
