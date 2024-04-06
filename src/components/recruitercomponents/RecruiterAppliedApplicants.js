import React, { useState, useEffect,useRef } from 'react';
import { useUserContext } from '../common/UserProvider';
import ApplicantAPIService,{ apiUrl } from '../../services/ApplicantAPIService';
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
import $ from 'jquery';

function RecruiterAppliedApplicants({selectedJobId}) {
  const [jobDetails, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  const { user } = useUserContext();
  const { jobId } = useParams();
  const isMounted = useRef(true);
  const tableref=useRef(null);
  
  const fetchAllAppliedApplicants = async () => {
    try {
      const response = await axios.get(`${apiUrl}/job/${selectedJobId}`);
      if(response){
        setLoading(false);
      }
        setApplicants(response.data);
        const $table= window.$(tableref.current);
     const timeoutId = setTimeout(() => {  
      $table.DataTable().destroy();
       $table.DataTable({responsive:true});
             }, 250);
    return () => {
       isMounted.current = false;
    };
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    }
    fetchAllAppliedApplicants();
    
  }, [selectedJobId]);

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  }
  const convertToLakhs = (amountInRupees) => {
    return (amountInRupees / 100000).toFixed(2); // Assuming salary is in rupees
  };



  return (
    <div>
    {loading ? null : (
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
                  {jobDetails && (
                    <div className="top-content">
                      <div className="features-job style-2 stc-apply  bg-white">
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
<a href="javascript:void(0);"> Exp &nbsp;{jobDetails.minimumExperience} - {jobDetails.maximumExperience} years</a>
</li>
<li>
<a href="javascript:void(0);">&#x20B9; {convertToLakhs(jobDetails.minSalary)} - &#x20B9; {convertToLakhs(jobDetails.maxSalary)} LPA</a>
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
                            <span>
<span style={{fontSize:'12px'}}>Posted on {formatDate(jobDetails.creationDate)}</span></span>
                            </div>
                            <div className="button-readmore">
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button
                                  className={`btn-apply btn-popup ${applied ? 'applied' : ''}`}
                                  
                                  disabled={jobDetails.jobStatus === 'Already Applied'}
                                  style={{
                                    backgroundColor:
                                      jobDetails.jobStatus === 'Already Applied' ? '#FEF1E8' : '#F97316',
                                    cursor: 'pointer',
                                    height: '40px',
                                    color: '#F97316',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    opacity:'80%',
                                    borderColor:'#F97316'
                                  }}
                                >
                                  <span className="icon-send"></span>&nbsp;
                                  {jobDetails.jobStatus === 'Already Applied' ? 'Applied' : 'Apply Now'}
                                </button>
                                
                                {/* <a
                                  href="/applicant-find-jobs"
                                  className="btn-apply btn-popup"
                                  style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                    padding: '5px 20px',
                                    backgroundColor: '#F97316',
                                    color: 'white',
                                    height: '40px',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  Cancel
                                </a> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
    )}
  </div>
  );
}
export default RecruiterAppliedApplicants;
