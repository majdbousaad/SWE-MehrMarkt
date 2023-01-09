import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { ILagerStatistik } from 'src/pages/Dashboard'



export default function LagerStatus({statistik}:{statistik:ILagerStatistik[]}) {

  
  const series = [
    {
      name: 'Lagerauslastung',
      data: statistik.map(row => {
        if(row.name == "total"){

          return {x: 'ganz', y: row.data*100}
        }

        return {x: row.name, y: row.data*100}
      })
    }
  ]

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'bar',
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
      enabled: true,
      formatter: function (val: number) {
        
        return val.toFixed(2) + "%";
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    legend: {
      show: true,
    },
    yaxis: {
      max:100,
      labels: {
        show: true,
        formatter: function (val: number) {

          return val.toFixed(2) + "%";
        }
      }

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
