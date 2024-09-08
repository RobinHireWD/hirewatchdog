import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectHits } from 'react-instantsearch-dom';
import CustomSearchBox from './CustomSearchBox';
import { countries, applicationSources, degrees, applicationStatuses, listingDurations } from './constants';
import './Tracker.css';

const searchClient = algoliasearch('21GLO4JOBR', '40ade772c34eddda66c63b5e75436e35');

const CustomHits = connectHits(({ hits, onNewCompany }) => (
  <CustomSearchBox hits={hits} onNewCompany={onNewCompany} isSuggestionsVisible={true} />
));

function Tracker() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    company: '',
    position: '',
    country: '',
    feedbacktime: 0,
    degree: '',
    applicationsource: '',
    salaryexpectation: '',
    applicationstatus: '',
    listingduration: '',
    experience: ''
  });

  const [isSuggestionsVisible, setSuggestionsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const limit = 5;

  // Fetch applications from backend with pagination
  useEffect(() => {
    fetch(`http://localhost:5001/applications?page=${currentPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications);
        setTotalApplications(data.total);
      })
      .catch((error) => console.error('Error fetching applications:', error));
  }, [currentPage]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSliderChange = (e) => {
    setForm({
      ...form,
      feedbacktime: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5001/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setApplications([...applications, data]);
          setForm({
            company: '',
            position: '',
            country: '',
            feedbacktime: 0,
            degree: '',
            applicationsource: '',
            salaryexpectation: '',
            applicationstatus: '',
            listingduration: '',
            experience: ''
          });
          setSuggestionsVisible(true);
          alert('Application submitted successfully!');
        } else {
          alert('An error occurred while submitting the application.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the application.');
      });
  };

  const handleCompanySelect = (company) => {
    setForm({ ...form, company });
    setSuggestionsVisible(false);
  };

  const getFeedbackLabel = (value) => {
    if (value <= 2) return 'Quick';
    if (value <= 5) return 'Average';
    if (value <= 7) return 'Slow';
    return 'Extremely Slow';
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="Tracker">
      <h2>Application Tracker</h2>
      <form onSubmit={handleSubmit}>
        <label>Company Name:</label>
        <InstantSearch indexName="companies" searchClient={searchClient}>
          <CustomHits onNewCompany={handleCompanySelect} isSuggestionsVisible={isSuggestionsVisible} />
        </InstantSearch>

        <label>Position Applied:</label>
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
        />

        <label>Country:</label>
        <select name="country" value={form.country} onChange={handleChange} required>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label>Experience in the Field (years):</label>
        <select
          name="experience"
          value={form.experience}
          onChange={handleChange}
        >
          <option value="">Select Experience</option>
          <option value="0-2">0-2 years</option>
          <option value="2-5">2-5 years</option>
          <option value="5-10">5-10 years</option>
          <option value="10-20">10-20 years</option>
        </select>

        <label>Feedback Time (in weeks):</label>
        <div className="range-container">
          <input
            type="range"
            min="0"
            max="12"
            value={form.feedbacktime}
            onChange={handleSliderChange}
          />
          <span>{getFeedbackLabel(form.feedbacktime)}</span>
        </div>

        <label>Degree:</label>
        <select name="degree" value={form.degree} onChange={handleChange} required>
          <option value="">Select Degree</option>
          {degrees.map((degree) => (
            <option key={degree} value={degree}>
              {degree}
            </option>
          ))}
        </select>

        <label>Application Source:</label>
        <select
          name="applicationsource"
          value={form.applicationsource}
          onChange={handleChange}
          required
        >
          <option value="">Select Source</option>
          {applicationSources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>

        <label>Salary Expectation (in USD):</label>
        <input
          type="number"
          name="salaryexpectation"
          value={form.salaryexpectation}
          onChange={handleChange}
          required
        />

        <label>Application Status:</label>
        <select
          name="applicationstatus"
          value={form.applicationstatus}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          {applicationStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <label>Listing Duration (weeks):</label>
        <input
          type="number"
          name="listingduration"
          value={form.listingduration}
          onChange={handleChange}
        />

        <button type="submit">Submit Application</button>
      </form>

      <h3>Tracked Applications</h3>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Country</th>
            <th>Feedback Time</th>
            <th>Degree</th>
            <th>Application Source</th>
            <th>Salary Expectation</th>
            <th>Status</th>
            <th>Listing Duration</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.company}</td>
              <td>{app.position}</td>
              <td>{app.country}</td>
              <td>{app.feedbacktime}</td>
              <td>{app.degree}</td>
              <td>{app.applicationsource}</td>
              <td>{app.salaryexpectation}</td>
              <td>{app.applicationstatus}</td>
              <td>{app.listingduration}</td>
              <td>{app.experience}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={(currentPage * limit) >= totalApplications}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Tracker;
