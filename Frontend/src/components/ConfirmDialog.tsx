import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

export default function ConfirmDialog({
  onConfirm,
  onDecline,
  title,
  content,
  open
}: {
  onConfirm: () => void
  onDecline: () => void
  title: string
  content: string
  open: boolean
}) {
  return (
    <Dialog open={open} onClose={onDecline}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDecline} color='primary'>
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color='primary' autoFocus>
          Bestätigen
        </Button>
      </DialogActions>
    </Dialog>
  )
}
