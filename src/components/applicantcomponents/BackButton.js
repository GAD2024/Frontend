import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ jobId }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1, { state: { reload: false } });
  };

  return (
    <button onClick={goBack}>
      Back
    </button>
  );
};

export default BackButton;
