import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEffect } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'

export interface IVerkaufAll {
    Datum: string, 
    id:number, 
    gesamtPreis: number
}
export default function Verkaufsverlauf({verkaeufe, fetchVerkaeufe}:{verkaeufe:IVerkaufAll[], fetchVerkaeufe: () => void}) {


  useEffect(() => {
    fetchVerkaeufe()
  }, [])

  

  return (
    <Card>
        <CardHeader title='Verkaufsverlauf' />
        <CardContent>
        <TableContainer sx={{maxHeight:200}} component={Paper}>

            <Table aria-label='simple table' >
            <TableHead>
                <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Warenkorb-ID</TableCell>
                <TableCell>Gesamtpreis</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {verkaeufe?.map((verkauf: IVerkaufAll) => (
                <TableRow hover key={verkauf.id} >
                    <TableCell>{verkauf.Datum}</TableCell>
                    <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{verkauf.id}</Typography>
                        <IconButton
                        color="primary"
                        size='small'
                        sx={{ p: 0, marginLeft: 1 }}
                        
                        //onClick={() => orderArrived(anstehendeLiefererung.id)}
                        >
                        <OpenInNewIcon fontSize='small' />
                        </IconButton>
                    </Box>
                    </TableCell>
                    <TableCell>{verkauf.gesamtPreis}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer> 
        </CardContent>
      </Card>
  )
}
