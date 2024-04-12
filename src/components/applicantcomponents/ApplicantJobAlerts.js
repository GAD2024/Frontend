import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../services/ApplicantAPIService';

import { useUserContext } from '../common/UserProvider';
import { useNavigate } from 'react-router-dom';

export default function ApplicantJobAlerts({ setSelectedJobId }) {
  const [jobAlerts, setJobAlerts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const userId = user.id;

  useEffect(() => {
    const fetchJobAlerts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/applyjob/applicant/job-alerts/${user.id}`);
        const alerts = response.data;
        setJobAlerts(alerts);
      } catch (error) {
        console.error('Error fetching job alerts:', error);
      }
    };
    fetchJobAlerts();
  }, [userId]);

  const getAuthToken = () => {
    return localStorage.getItem('jwtToken');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch the user's profile ID
        const profileIdResponse = await axios.get(`${apiUrl}/applicantprofile/${userId}/profileid`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        const profileId = profileIdResponse.data;
  
        // Fetch jobs based on profile ID
        let jobData;
        if (profileId === 0) {
          // Fetch promoted jobs
          const promotedJobsResponse = await axios.get(`${apiUrl}/job/promote/${userId}/yes`, {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });
          jobData = promotedJobsResponse.data;
        } else {
          // Fetch recommended jobs
          const recommendedJobsResponse = await axios.get(`${apiUrl}/recommendedjob/findrecommendedjob/${userId}`, {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          });
          jobData = recommendedJobsResponse.data;
        }
  
        // Set the fetched job data in state
        setJobs(jobData);
        
        // Print the jobId
        console.log("JobId:", jobData.jobId);
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, [userId]);
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  }

  const handleJobAlertClick = (jobId) => {
    setSelectedJobId(jobId);
    navigate('/applicant-view-job');
  };

  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Your Job Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-dashboard-dyagram">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="box-notifications">
                {jobAlerts.length > 0 ? (
                  <ul>
                    {jobAlerts.map(alert => (
                      <li key={alert.alertsId} onClick={() => handleJobAlertClick(alert.jobId)} className='inner bg-white' style={{ width: '100%', padding: '2%', borderRadius: '10px' }}>
                        <a className="noti-icon"><span className="icon-bell1"></span></a>
                        <h4>Success!&nbsp; {alert.companyName} has updated the job status to {' '}
                          {alert.status} on {' '} {formatDate(alert.changeDate)}. For the role of {' '} {alert.jobTitle}.
                        </h4>
                        {alert.applyJob && (
                          <a href="#" className="p-16 color-3">{alert.applyJob.jobTitle}</a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <h3>No alerts are found.</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}