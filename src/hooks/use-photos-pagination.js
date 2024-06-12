import React, { useState, useEffect } from 'react';
import { applyPagination } from '../utils/apply-pagination';

export const usePhotosPagination = images => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [imagesToShow, setImagesToShow] = useState([]);

  const handleShowMorePhotos = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    setPage(0);
    setIsLoading(true);
    setImagesToShow([]);
    if (images?.length > 0) {
      setImagesToShow(applyPagination(images, 0, rowsPerPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    setIsLoading(false);
  }, [imagesToShow]);

  useEffect(() => {
    setImagesToShow([
      ...imagesToShow,
      ...applyPagination(images, page, rowsPerPage),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return { imagesToShow, isLoading, handleShowMorePhotos };
};
