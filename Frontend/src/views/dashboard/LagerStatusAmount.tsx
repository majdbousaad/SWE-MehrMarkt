import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { ILagerStatistik } from 'src/pages/Dashboard'
import { useEffect, useState } from 'react'

export default function LagerStatusAmount({ statistik }: { statistik: ILagerStatistik[] }) {
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    setTimeout(() => setDisplay(true), 300)
  }, [])

  if (!display) {
    return <></>
  }

  function totalLoad() {
    let total = 0
    statistik.forEach(row => {
      total += row.load
    })

    return total
  }

  function maxLoad() {
    let maxCapacity = 0
    statistik
      .filter(row => row.name != 'total')
      .forEach(row => {
        maxCapacity += row.capacity
      })

    return maxCapacity
  }

  const maxLoadval = maxLoad()
  const totalLoadval = totalLoad()

  const series = [
    {
      name: 'Lagerauslastung Menge',
      data: statistik.map(row => {
        if (row.name == 'total') {
          return { x: 'Alle Lager', y: totalLoadval }
        }

        return { x: row.name, y: row.load }
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
        return val.toString()
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    legend: {
      show: true
    },
    yaxis: {
      max: maxLoadval,
      labels: {
        show: true,
        formatter: function (val: number) {
          return val.toString()
        }
      }
    }
  }

  return (
    <Card className='h-full w-full p-2 bg-red-600'>
      <CardHeader title='Lagerstatus Menge' />
      <CardContent>
        <ReactApexcharts options={options} series={series} type='bar' height={350} />
      </CardContent>
    </Card>
  )
}
