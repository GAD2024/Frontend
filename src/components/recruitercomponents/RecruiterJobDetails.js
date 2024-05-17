import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ApplicantAPIService,{ apiUrl } from '../../services/ApplicantAPIService';

function RecruiterJobDetails() {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const { jobId } = useParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/job/${jobId}`);
        setJobDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  const convertToLakhs = (amountInRupees) => {
    return (amountInRupees / 100000).toFixed(2); // Assuming salary is in rupees
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : jobDetails ? (
        <div className="dashboard__content">
          <section className="page-title-dashboard">
            <div className="themes-container">
              <div className="row">
                <div className="col-lg-12 col-md-12 ">
                  <div className="title-dashboard">
                    <div className="title-dash flex2">Full Job Details</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flat-dashboard-setting flat-dashboard-setting2">
            <div className="themes-container">
              <div className="content-tab">
                <div className="inner">
                  <article className="job-article">
                    <div className="top-content">
                      <div className="features-job style-2 stc-apply bg-white">
                        <div className="job-archive-header">
                          <div className="inner-box">
                            <div className="box-content">
                              <h4>
                                <a href="#">{jobDetails.companyname}</a>
                              </h4>
                              <h3>
                                <a href="#">{jobDetails.jobTitle}</a>
                              </h3>
                              <ul>
                                <li>
                                  <span className="icon-map-pin"></span>
                                  &nbsp;{jobDetails.location}
                                </li>
                              </ul>
                              <div className="button-readmore"></div>
                            </div>
                          </div>
                        </div>
                        <div className="job-archive-footer">
                          <div className="job-footer-left">
                            <ul className="job-tag">
                              <li>
                                <a href="#">{jobDetails.employeeType}</a>
                              </li>
                              <li>
                                <a href="#">{jobDetails.remote ? 'Remote' : 'Office-based'}</a>
                              </li>
                              <li>
                                <a href="javascript:void(0);">
                                  Exp &nbsp;{jobDetails.minimumExperience} - {jobDetails.maximumExperience} years
                                </a>
                              </li>
                              <li>
                                <a href="javascript:void(0);">
                                  &#x20B9; {convertToLakhs(jobDetails.minSalary)} - &#x20B9;{' '}
                                  {convertToLakhs(jobDetails.maxSalary)} LPA
                                </a>
                              </li>
                            </ul>
                            <div className="star">
                              {Array.from({ length: jobDetails.starRating }).map((_, index) => (
                                <span key={index} className="icon-star-full"></span>
                              ))}
                            </div>
                          </div>
                          <div className="job-footer-right">
                            <div className="price">
                              <span style={{ fontSize: '12px' }}>Posted on {formatDate(jobDetails.creationDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {jobDetails && (
                      <div className="inner-content">
                        <h5>Full Job Description</h5>
                        <p>{jobDetails.description}</p>
                      </div>
                    )}
                  </article>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <p>No job details available.</p>
      )}
    </div>
  );
}

export default RecruiterJobDetails;
