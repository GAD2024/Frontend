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
  const [countSavedJobs, setSavedJobsCount] = useState(0);
  const [countAppliedJobs, setAppliedJobsCount] = useState(0);
  

  const { user } = useUserContext();
  // const { jobId } = useParams();
  const isMounted = useRef(true);
  const tableref=useRef(null);
  
//   const fetchAllAppliedApplicants = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/job/${selectedJobId}`);
//       if(response){
//         setLoading(false);
//       }
//         setApplicants(response.data);

//         const recruiterId = response.data.recruiterId;
//         const jobId = response.data.id;

//         const $table= window.$(tableref.current);
//      const timeoutId = setTimeout(() => {  
//       $table.DataTable().destroy();
//        $table.DataTable({responsive:true});
//              }, 250);
//     return () => {
//        isMounted.current = false;
//     };
//     } catch (error) {
//       console.error('Error fetching applicants:', error);
//     }
//   };


//   useEffect(() => {
//   const fetchAllAppliedApplicantsAndSavedJobsCount = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/job/${selectedJobId}`);
//       if (response) {
//         setLoading(false);
//       }
//       setApplicants(response.data);

//       // Extracting recruiterId from the response
//       const recruiterId = response.data.recruiterId;

//       // Make the second API call to fetch saved jobs count
//       axios.get(`${apiUrl}/savedjob/count?recruiterId=${recruiterId}&jobId=${selectedJobId}`)
//         .then((response) => {
//           setSavedJobsCount(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching saved jobs count:', error);
//         });

//       const $table = window.$(tableref.current);
//       const timeoutId = setTimeout(() => {
//         $table.DataTable().destroy();
//         $table.DataTable({ responsive: true });
//       }, 250);

//       return () => {
//         isMounted.current = false;
//       };
//     } catch (error) {
//       console.error('Error fetching applicants:', error);
//     }
//   };

//   fetchAllAppliedApplicantsAndSavedJobsCount();
// }, []);



//   useEffect(() => {
//     const jwtToken = localStorage.getItem('jwtToken');
//     if (jwtToken) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
//     }
//     fetchAllAppliedApplicants();
    
//   }, [selectedJobId]);

//only saved jobs
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/job/${selectedJobId}`);
//       if (response) {
//         setLoading(false);
//       }
//       setApplicants(response.data);

//       // Extracting recruiterId and jobId from the response
//       const recruiterId = response.data.recruiterId;
//       const jobId = response.data.id;

//       // Make the second API call to fetch saved jobs count
//       axios.get(`${apiUrl}/savedjob/count?recruiterId=${recruiterId}&jobId=${jobId}`)
//         .then((response) => {
//           setSavedJobsCount(response.data);
//         })
//         .catch((error) => {
//           console.error('Error fetching saved jobs count:', error);
//         });

//       const $table = window.$(tableref.current);
//       const timeoutId = setTimeout(() => {
//         $table.DataTable().destroy();
//         $table.DataTable({ responsive: true });
//       }, 250);

//       return () => {
//         isMounted.current = false;
//       };
//     } catch (error) {
//       console.error('Error fetching applicants:', error);
//     }
//   };

//   const jwtToken = localStorage.getItem('jwtToken');
//   if (jwtToken) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
//   }

//   fetchData();
// }, [selectedJobId]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/job/${selectedJobId}`);
      if (response) {
        setLoading(false);
      }
      setApplicants(response.data);

      // Extracting recruiterId and jobId from the response
      const recruiterId = response.data.recruiterId;
      const jobId = response.data.id;

      // Make the API call to fetch saved jobs count
      axios.get(`${apiUrl}/savedjob/count?recruiterId=${recruiterId}&jobId=${jobId}`)
        .then((response) => {
          setSavedJobsCount(response.data);
        })
        .catch((error) => {
          console.error('Error fetching saved jobs count:', error);
        });

      // Make the API call to fetch applied jobs count
      axios.get(`${apiUrl}/job/count/applied?recruiterId=${recruiterId}&jobId=${jobId}`)
        .then((response) => {
          setAppliedJobsCount(response.data);
        })
        .catch((error) => {
          console.error('Error fetching applied jobs count:', error);
        });

      const $table = window.$(tableref.current);
      const timeoutId = setTimeout(() => {
        $table.DataTable().destroy();
        $table.DataTable({ responsive: true });
      }, 250);

      return () => {
        isMounted.current = false;
      };
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  }

  fetchData();
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

                      <div className="box-icon wrap-counter flex">
              <div className="icon style4">
                <span className="icon-bag">
                  <svg
                    width={36}
                    height={48}
                    viewBox="0 0 36 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.3496 0H2.34998C1.92564 0 1.51868 0.168569 1.21862 0.468623C0.918569 0.768678 0.75 1.17564 0.75 1.59998V46.3994C0.749887 46.7009 0.834958 46.9963 0.99541 47.2515C1.15586 47.5068 1.38517 47.7115 1.6569 47.8421C1.92863 47.9727 2.23173 48.0239 2.53128 47.9897C2.83082 47.9555 3.11462 47.8374 3.34997 47.649L18.3498 35.6476L33.3496 47.6474C33.5848 47.8357 33.8685 47.9538 34.1679 47.9881C34.4673 48.0223 34.7703 47.9712 35.0419 47.8408C35.3136 47.7104 35.5429 47.506 35.7035 47.2509C35.8641 46.9959 35.9494 46.7008 35.9496 46.3994V1.59998C35.9496 1.17564 35.781 0.768678 35.4809 0.468623C35.1809 0.168569 34.7739 0 34.3496 0Z"
                      fill="#FFB321"
                    />
                  </svg>
                </span>
              </div>
              <div className="content">
              <h3> {countSavedJobs}</h3>
                <h4 className="title-count">Saved Jobs</h4>
              </div>
            </div>
     {/* count of view applicants to the job  */}
            <div className="box-icon wrap-counter flex">
              <div className="icon style4">
                <span className="icon-bag">
                  <svg
                    width={36}
                    height={48}
                    viewBox="0 0 36 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.3496 0H2.34998C1.92564 0 1.51868 0.168569 1.21862 0.468623C0.918569 0.768678 0.75 1.17564 0.75 1.59998V46.3994C0.749887 46.7009 0.834958 46.9963 0.99541 47.2515C1.15586 47.5068 1.38517 47.7115 1.6569 47.8421C1.92863 47.9727 2.23173 48.0239 2.53128 47.9897C2.83082 47.9555 3.11462 47.8374 3.34997 47.649L18.3498 35.6476L33.3496 47.6474C33.5848 47.8357 33.8685 47.9538 34.1679 47.9881C34.4673 48.0223 34.7703 47.9712 35.0419 47.8408C35.3136 47.7104 35.5429 47.506 35.7035 47.2509C35.8641 46.9959 35.9494 46.7008 35.9496 46.3994V1.59998C35.9496 1.17564 35.781 0.768678 35.4809 0.468623C35.1809 0.168569 34.7739 0 34.3496 0Z"
                      fill="#FFB321"
                    />
                  </svg>
                </span>
              </div>
              <div className="content">
              <h3> {countSavedJobs}</h3>
                <h4 className="title-count">Views</h4>
              </div>
            </div>
            {/* count of applied applicants to the job  */}
            <div className="box-icon wrap-counter flex">
              <div className="icon style4">
                <span className="icon-bag">
                  <svg
                    width={36}
                    height={48}
                    viewBox="0 0 36 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.3496 0H2.34998C1.92564 0 1.51868 0.168569 1.21862 0.468623C0.918569 0.768678 0.75 1.17564 0.75 1.59998V46.3994C0.749887 46.7009 0.834958 46.9963 0.99541 47.2515C1.15586 47.5068 1.38517 47.7115 1.6569 47.8421C1.92863 47.9727 2.23173 48.0239 2.53128 47.9897C2.83082 47.9555 3.11462 47.8374 3.34997 47.649L18.3498 35.6476L33.3496 47.6474C33.5848 47.8357 33.8685 47.9538 34.1679 47.9881C34.4673 48.0223 34.7703 47.9712 35.0419 47.8408C35.3136 47.7104 35.5429 47.506 35.7035 47.2509C35.8641 46.9959 35.9494 46.7008 35.9496 46.3994V1.59998C35.9496 1.17564 35.781 0.768678 35.4809 0.468623C35.1809 0.168569 34.7739 0 34.3496 0Z"
                      fill="#FFB321"
                    />
                  </svg>
                </span>
              </div>
              <div className="content">
              <h3> {countAppliedJobs}</h3>
                <h4 className="title-count">Applies</h4>
              </div>
            </div>

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
