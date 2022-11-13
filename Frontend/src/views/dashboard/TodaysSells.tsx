import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

export default function TodaysSells() {
  return (
    <Paper className='h-full w-full p-5'>
      <Typography variant='h6'>Heutige Verkäufe</Typography>
      <Box className='flex flex-col justify-center items-center h-full '>
        <Typography variant='h5' className='' align='center'>
          <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {' '}
            212 Produkte
          </Box>{' '}
          verkauft. 😎
        </Typography>
      </Box>
    </Paper>
  )
}
