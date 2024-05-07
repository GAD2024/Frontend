import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ jobId, appliedJobsUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (jobId) {
      const jobElement = document.getElementById(`job-${jobId}`);
      if (jobElement) {
        console.log('Found Job Element:', jobElement); // Log the element
        jobElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error('Job element not found:', jobId);
      }
      localStorage.removeItem('checkedJobId');
      localStorage.removeItem('appliedJobsUrl');
    } else {
      // Handle case where jobId is not available
      navigate(-1);
    }
  };
  
  


  return (
    <button onClick={handleClick}>Back</button>
  );
};

export default BackButton;
