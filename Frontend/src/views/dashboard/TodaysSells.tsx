import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function TodaysSells() {

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
        console.log('missing error handling')
        console.log(error)
      })
  }

  return (
    <Paper className='h-full w-full p-5 flex flex-col justify-center items-start'>
      <Typography variant='h6' align='left'>
        Heutige Verkäufe
      </Typography>
      <Box className='flex flex-col justify-center items-center h-full w-full '>
        <Typography variant='h1' className='' align='center'>
          {anzahl.anzahl}
        </Typography>
        <Typography variant='h6' className='' align='center'>
          Produkte verkauft. 😎
        </Typography>
      </Box>
    </Paper>
  )
}
