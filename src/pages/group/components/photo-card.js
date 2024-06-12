/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  SvgIcon,
} from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';

const setOrientationStyles = orientation => {
  if (orientation === 8)
    return { transform: 'rotate(-90deg)', height: '239px' };
  if (orientation === 6) return { transform: 'rotate(90deg)', height: '239px' };
  return { width: '239px', height: '165px' };
};

const PhotoCard = props => {
  const {
    baseURL,
    orientation,
    isDownloadButtonActive = false,
    isZoomButtonActive = false,
  } = props;
  const baseURLString = new String(baseURL).toString();
  const [imageURL, setImageURL] = useState(
    baseURLString.replace('.jpg1', '.jpg?'),
  );
  const [miniImageURL, setMiniImageURL] = useState(
    imageURL.replace('IMG_', 'mini_IMG_'),
  );
  const [thumbImageURL, setThumbImageURL] = useState(
    imageURL.replace('IMG_', 'thumb_IMG_'),
  );
  const [imageOrientation, setImageOrientation] = useState(
    setOrientationStyles(orientation),
  );

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const downloadImage = async (imageSrc, nameOfDownload = 'foto') => {
    const method = 'GET';
    axios
      .request({
        url: imageSrc,
        method,
        responseType: 'blob', // important
      })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', nameOfDownload + '.jpg'); // any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => console.log(err));
  };

  const handleDownload = () => {
    downloadImage(imageURL).catch(err => console.log(err));
  };

  const handleOpen = () => setOpenBackdrop(true);

  const handleClose = () => setOpenBackdrop(false);

  return (
    <>
      <Card
        elevation={3}
        sx={{
          width: 239,
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.26)',
        }}
        color="primary"
      >
        <CardMedia
          sx={{
            width: '239px',
            height: '165px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={miniImageURL}
            style={{
              ...imageOrientation,
              position: 'relative',
              top: '0',
            }}
          />
        </CardMedia>
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent="center">
            {isDownloadButtonActive && (
              <Button variant="contained" onClick={handleDownload}>
                <SvgIcon fontSize="small">
                  <ArrowDownTrayIcon />
                </SvgIcon>
              </Button>
            )}

            {isZoomButtonActive && (
              <Button variant="contained" onClick={handleOpen}>
                <SvgIcon fontSize="small">
                  <EyeIcon />
                </SvgIcon>
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Backdrop
        open={openBackdrop}
        onClick={handleClose}
        sx={{ zIndex: '2000000000' }}
      >
        <img src={imageURL} style={{ width: '100%', maxWidth: '300px' }} />
      </Backdrop>
    </>
  );
};

PhotoCard.propTypes = {
  baseURL: PropTypes.string.isRequired,
  orientation: PropTypes.number.isRequired,
  isDownloadButtonActive: PropTypes.bool,
  isZoomButtonActive: PropTypes.bool,
};

export default PhotoCard;
