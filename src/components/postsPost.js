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

  const handleImageChange = e => {
    setImage(e.target.files[0]);
  };

  const handleConfirm = async () => {
    const userData = JSON.parse(localStorage.userinfo);
    const idUser = userData?.id;

    if (!idUser) {
      setSyncResult({
        success: false,
        error: new Error('Usuario no autenticado'),
      });
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          color="primary"
          onClick={handleClickOpen}
          startIcon={<InsertCommentIcon />}
          variant="contained"
          sx={{ 
            borderRadius: '8px', 
            backgroundColor: '#1976d2', 
            color: 'white', 
            padding: '6px 12px', 
            fontWeight: 'bold',
            fontSize: '0.875rem',
            minWidth: '150px',
            '&:hover': { 
              backgroundColor: '#115293' 
            } 
          }}
        >
          Comparte parte de tu dia campeon
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
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
            variant="outlined"
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            margin="dense"
            id="content"
            label="Contenido"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': { backgroundColor: '#115293' },
              }}
            >
              Subir Imagen
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Box>
          {syncResult && syncResult.success && (
            <Typography sx={{ mt: 2, color: 'green' }}>
              Post agregado exitosamente
            </Typography>
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
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': { backgroundColor: '#115293' },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
