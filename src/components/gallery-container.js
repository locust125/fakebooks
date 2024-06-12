/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  SvgIcon,
} from '@mui/material';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import { FormatImageUrl } from 'src/utils/format-image-url';

const GalleryContainer = props => {
  const { images, isOpen = false, handleClose, selectedID = 0 } = props;
  const [imageURLS, setImageURLS] = useState([]);
  const [imageSelectedId, setImageSelectedId] = useState(selectedID);
  const [isLoading, setIsLoading] = useState(true);

  const setIsLoadingTrue = () => {
    setIsLoading(true);
  };

  const setIsLoadingFalse = () => {
    setIsLoading(false);
  };

  const prevImage = () => {
    if (!imageURLS || imageSelectedId <= 0) return;
    setIsLoadingTrue();
    setImageSelectedId(prev => prev - 1);
  };

  const nextImage = () => {
    if (!imageURLS || imageSelectedId >= imageURLS.length - 1) return;
    setIsLoadingTrue();
    setImageSelectedId(prev => prev + 1);
  };

  useEffect(() => {
    setImageURLS(
      images.map(image => {
        const images = FormatImageUrl(image.Path);
        return {
          idPhotography: image.idPhotography,
          ...images,
        };
      }),
    );
  }, [images]);

  useEffect(() => {
    setIsLoadingTrue();
    setImageSelectedId(selectedID);
  }, [selectedID]);

  // useEffect(() => {
  //   setIsLoadingFalse();
  // }, [imageSelectedId]);

  // useEffect(() => {
  //   if (selectedID === imageSelectedId) {
  //     setIsLoadingFalse();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="image-slider-modal"
      aria-describedby="image-slider-description"
      sx={{
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <>
        {imageURLS.length > 0 && (
          <>
            <Button
              onClick={prevImage}
              size="small"
              variant="contained"
              disabled={imageSelectedId <= 0}
              sx={{
                height: 'fit-content',
              }}
            >
              <SvgIcon fontSize="large">
                <ChevronLeftIcon color="white" />
              </SvgIcon>
            </Button>
            <div
              style={{
                width: '60%',
                maxWidth: '700px',
                display: 'grid',
              }}
            >
              {isLoading && (
                <CircularProgress
                  sx={{
                    color: '#fff',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              )}

              <img
                src={imageURLS[imageSelectedId].imageURL}
                onLoad={setIsLoadingFalse}
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  objectFit: 'contain',
                  display: isLoading ? 'none' : 'block',
                }}
              />
            </div>
            <Button
              onClick={nextImage}
              size="small"
              variant="contained"
              disabled={imageSelectedId >= imageURLS.length - 1}
              sx={{
                height: 'fit-content',
              }}
            >
              <SvgIcon fontSize="large">
                <ChevronRightIcon color="white" />
              </SvgIcon>
            </Button>
          </>
        )}
      </>
    </Modal>
  );
};

GalleryContainer.propTypes = {
  images: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedID: PropTypes.number.isRequired,
};

export default GalleryContainer;
