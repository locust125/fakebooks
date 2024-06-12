import { useState } from 'react';
import PropTypes from 'prop-types';

const useLoading = props => {
  const [isLoading, setIsLoading] = useState(props.defaultState || false);

  const setIsLoadingTrue = () => setIsLoading(true);
  const setIsLoadingFalse = () => setIsLoading(false);

  return {
    isLoading,
    setIsLoadingTrue,
    setIsLoadingFalse,
  };
};

useLoading.propTypes = {
  defaultState: PropTypes.bool,
};

export default useLoading;
