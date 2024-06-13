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
  Typography,
  Box,
} from '@mui/material';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import authService from 'src/services/auth-service';

export default function PostForm() {
  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [confirmClicked, setConfirmClicked] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [image, setImage] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
    setConfirmClicked(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleConfirm = async () => {
    const userData = JSON.parse(localStorage.userinfo); 
    const idUser = userData?.id;

    if (!idUser) {
      setSyncResult({ success: false, error: new Error('Usuario no autenticado') });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('idUser', idUser);
    if (image) {
      formData.append('imagePost', image);
    }

    try {
      const response = await authService.postData('add/post', formData);
      console.log('Post agregado exitosamente', response);
      setSyncResult({ success: true });

      // Refrescar la página después de 1 segundo si el post se agregó exitosamente
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1000 milisegundos = 1 segundo
    } catch (error) {
      console.error('Error al agregar post', error);
      setSyncResult({ success: false, error });
    } finally {
      setConfirmClicked(true);
    }
  };

  return (
    <React.Fragment>
      <Button
        color="inherit"
        onClick={handleClickOpen}
        startIcon={<InsertCommentIcon />}
        variant="outlined"
        sx={{ borderRadius: '20px', borderColor: '#556cd6', color: '#556cd6', fontWeight: 'bold' }}
      >
        Comparte tus momentos
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Agregar nuevo post.`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Llena los detalles del post y sube una imagen.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Título"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="Contenido"
            type="text"
            fullWidth
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              component="label"
              sx={{ backgroundColor: '#556cd6', color: 'white', '&:hover': { backgroundColor: '#3f51b5' } }}
            >
              Subir Imagen
              <input
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>
          {syncResult && syncResult.success && (
            <Typography sx={{ mt: 2, color: 'green' }}>Post agregado exitosamente</Typography>
          )}
          {syncResult && !syncResult.success && (
            <Typography sx={{ mt: 2, color: 'red' }}>
              Error al agregar post: {syncResult.error.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            autoFocus
            disabled={(syncResult && syncResult.success) || confirmClicked}
            sx={{ backgroundColor: '#556cd6', color: 'white', '&:hover': { backgroundColor: '#3f51b5' } }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
