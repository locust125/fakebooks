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
import { useCallback, useEffect, useState } from 'react';
import { FormatImageUrl } from 'src/utils/format-image-url';

const setOrientationStyles = orientation => {
  if (orientation === 8) return { transform: 'rotate(-90deg)', height: '145%' };
  if (orientation === 6) return { transform: 'rotate(90deg)', height: '145%' };
  return { width: '100%' };
};

const PhotoCard = props => {
  const {
    baseURL,
    orientation,
    isDownloadButtonActive = false,
    isZoomButtonActive = false,
    handleZoom = () => {},
  } = props;

  const {
    imageURL: mainImage,
    miniImageURL: miniImage,
    thumbImageURL: thumbImage,
  } = FormatImageUrl(baseURL);
  const [imageURL, setImageURL] = useState(mainImage);
  const [miniImageURL, setMiniImageURL] = useState(miniImage);
  const [thumbImageURL, setThumbImageURL] = useState(thumbImage);
  const [imageOrientation, setImageOrientation] = useState(
    setOrientationStyles(orientation),
  );

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

  useEffect(() => {
    setImageOrientation(setOrientationStyles(orientation));
  }, [orientation]);

  useEffect(() => {
    setImageURL(mainImage);
    setMiniImageURL(miniImage);
    setThumbImageURL(thumbImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseURL]);

  return (
    <>
      <Card
        elevation={3}
        sx={{
          width: '100%',
          boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.26)',
        }}
        color="primary"
      >
        <CardMedia
          sx={{
            width: '100%',
            aspectRatio: '13/9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            decoding="async"
            src={miniImageURL}
            style={{
              ...imageOrientation,
              aspectRatio: '13/9',
              position: 'relative',
              top: '0',
            }}
            loading="lazy"
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
              <Button variant="contained" onClick={handleZoom}>
                <SvgIcon fontSize="small">
                  <EyeIcon />
                </SvgIcon>
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

PhotoCard.propTypes = {
  baseURL: PropTypes.string.isRequired,
  orientation: PropTypes.number.isRequired,
  isDownloadButtonActive: PropTypes.bool,
  isZoomButtonActive: PropTypes.bool,
  handleZoom: PropTypes.func,
};

export default PhotoCard;
