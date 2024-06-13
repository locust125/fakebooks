import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import authService from 'src/services/auth-service';

export default function SynchronizationDialog(props) {
  const { post } = props;

  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [confirmClicked, setConfirmClicked] = React.useState(false);
  const [comment, setComment] = React.useState(''); // Nuevo estado para el comentario

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
    setConfirmClicked(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    const userData = JSON.parse(localStorage.userinfo); // Obtener los datos del usuario del localStorage
    const idUser = userData?.id; // Extraer el id del usuario

    if (!idUser) {
      setSyncResult({ success: false, error: new Error('Usuario no autenticado') });
      return;
    }

    const commentData = {
      idUser,
      comment,
      postId: post,
    };

    try {
      const response = await authService.postData('post/comment', commentData);
      console.log('Comentario agregado exitosamente', response);
      setSyncResult({ success: true });
    } catch (error) {
      console.error('Error al agregar comentario', error);
      setSyncResult({ success: false, error });
    } finally {
      setOpen(true);
      setConfirmClicked(true);
    }
  };

  return (
    <React.Fragment>
      <Button
        color="inherit"
        onClick={handleClickOpen}
      >
        <IconButton aria-label="share">
          <InsertCommentIcon />
        </IconButton>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Agregar comentario.`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al agregar un comentario.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comentario"
            type="text"
            fullWidth
            variant="standard"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {syncResult && syncResult.success && (
            <div style={{ color: 'green' }}>Comentario agregado exitosamente</div>
          )}
          {syncResult && !syncResult.success && (
            <div style={{ color: 'red' }}>
              Error al agregar comentario: {syncResult.error.message}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            disabled={(syncResult && syncResult.success) || confirmClicked}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

SynchronizationDialog.propTypes = {
  post: PropTypes.string.isRequired,
};
