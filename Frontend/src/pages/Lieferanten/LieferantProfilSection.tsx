import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { ILieferantJsonResponseOne } from '../../lib/interfaces'
import { DisplayEditingControl } from './LieferantenProfilDialog'
import { useState } from 'react'

export function LieferantProfilSection({
  lieferant,
  setLieferant,
  isEditing,
  handleSaveEditing,
  handleStartEditing
}: {
  lieferant: ILieferantJsonResponseOne
  setLieferant: (lieferant: ILieferantJsonResponseOne) => void
  isEditing: boolean
  handleSaveEditing: () => void
  handleStartEditing: () => void
}) {
  function onStatusChange() {
    setLieferant({ ...lieferant, status: !lieferant.status })
  }

  return (
    <>
      <Typography variant='h6' align='center'>
        Profil
      </Typography>
      <Box className='p-5 flex flex-col gap-4'>
        <TextField
          placeholder='Name*'
          defaultValue={lieferant.name}
          disabled={!isEditing}
          onChange={e => setLieferant({ ...lieferant, name: e.target.value })}
          fullWidth
          variant={isEditing ? 'outlined' : 'standard'}
          size='small'
        />
        <TextField
          placeholder='Anschrift*'
          defaultValue={lieferant.address}
          onChange={e => setLieferant({ ...lieferant, address: e.target.value })}
          disabled={!isEditing}
          fullWidth
          variant={isEditing ? 'outlined' : 'standard'}
          size='small'
        />
        <TextField
          placeholder='Kontaktdaten*'
          defaultValue={lieferant.contact}
          onChange={e => setLieferant({ ...lieferant, contact: e.target.value })}
          disabled={!isEditing}
          fullWidth
          variant={isEditing ? 'outlined' : 'standard'}
          size='small'
        />
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={lieferant.status} onChange={onStatusChange} />}
            label={lieferant.status ? 'Aktiv' : 'Inaktiv'}
            disabled={!isEditing}
          />
        </FormGroup>

        <DisplayEditingControl
          handleSaveEditing={handleSaveEditing}
          handleStartEditing={handleStartEditing}
          isEditing={isEditing}
        />
      </Box>
    </>
  )
}
