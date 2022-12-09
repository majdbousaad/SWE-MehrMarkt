import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import { ILieferungAll } from './EinkaufPage'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Lieferungen({ lieferungen, orderArrived, arrived }: { lieferungen: ILieferungAll[], orderArrived: (lieferung_id: number) => void, arrived: boolean}) {
  

  return (
    <>
      <Card>
        <CardHeader title={arrived? 'Gelieferte Bestellungen' : 'Ausstehende Lieferungen'} />
        <CardContent>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Lieferungsnummer</TableCell>
              <TableCell>Lieferant</TableCell>
              <TableCell>{arrived? 'Lieferdatum': 'Vsl. Lieferdatum'}</TableCell>
              {!arrived &&(<TableCell>Zugestellt</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {lieferungen?.map((lieferung: ILieferungAll) => (
              <TableRow hover key={lieferung.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{lieferung.id}</Typography>
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
                <TableCell>{lieferung.lieferant}</TableCell>
                <TableCell>{arrived? lieferung.tats : lieferung.vsl}</TableCell>
                {!arrived && (
                <TableCell><IconButton 
                      color="primary" 
                      aria-label="add to shopping cart"
                      onClick={() => orderArrived(lieferung.id)}
                      >
                      <DownloadDoneIcon />
                      </IconButton>
                </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </>
  )
}
