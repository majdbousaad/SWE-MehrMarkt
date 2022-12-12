import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {useSnackbar} from 'notistack'

interface ILagerStatistik{
  name: string,
  data: number
}

export default function LagerStatus() {

  const [statistik, setStatistik] = useState<ILagerStatistik[]>([])
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    fetchStatistik()

  }, [])


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
  const series = [
    {
      name: 'Lagerauslastung',
      data: statistik.map(row => {
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
