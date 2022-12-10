import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

export default function TodaysSells({data}:{data: {anzahl:number}}) {

  return (
    <Paper className='h-full w-full p-5 flex flex-col justify-center items-start'>
      <Typography variant='h6' align='left'>
        Heutige Verkäufe
      </Typography>
      <Box className='flex flex-col justify-center items-center h-full w-full '>
        <Typography variant='h1' className='' align='center'>
          {data.anzahl}
        </Typography>
        <Typography variant='h6' className='' align='center'>
          Produkte verkauft. 😎
        </Typography>
      </Box>
    </Paper>
  )
}
