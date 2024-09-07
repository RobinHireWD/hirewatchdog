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
    feedbackTime: 0,
    degree: '',
    applicationSource: '',
    salaryExpectation: '',
    ApplicationStatus: '',
    listingDuration: '',
    experience: ''
  });

  const [isSuggestionsVisible, setSuggestionsVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const limit = 5;

  // Fetch applications from backend with pagination
  useEffect(() => {
    fetch(`/applications?page=${currentPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications);
        setTotalApplications(data.total);
      });
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
      feedbackTime: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // POST form data to the backend
    fetch('/applications', {
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
            feedbackTime: 0,
            degree: '',
            applicationSource: '',
            salaryExpectation: '',
            ApplicationStatus: '',
            listingDuration: '',
            experience: ''
          });
          setSuggestionsVisible(true);
        } else {
          alert(data.error); // Handle duplicate entry case
        }
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
            name="feedbackTime"
            min="0"
            max="10"
            step="1"
            value={form.feedbackTime}
            onChange={handleSliderChange}
          />
          <div className="range-labels">
            <span>0</span>
            <span>2</span>
            <span>5</span>
            <span>7</span>
            <span>10</span>
          </div>
          <div className="range-value">
            {form.feedbackTime} weeks - {getFeedbackLabel(form.feedbackTime)}
          </div>
        </div>

        <label>Highest Degree:</label>
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
          name="applicationSource"
          value={form.applicationSource}
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

        <label>Position Posting Duration (in weeks):</label>
        <select
          name="listingDuration"
          value={form.listingDuration}
          onChange={handleChange}
        >
          <option value="">Select Duration</option>
          {listingDurations.map((week) => (
            <option key={week} value={week}>
              {week} week{week > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <label>Salary Expectation (Annual in USD):</label>
        <input
          type="number"
          name="salaryExpectation"
          value={form.salaryExpectation}
          onChange={handleChange}
          placeholder="e.g., 60000"
          required
        />

        <label>Application Status:</label>
        <select
          name="ApplicationStatus"
          value={form.ApplicationStatus}
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

        <button type="submit">Add Application</button>
      </form>

      <h3>Tracked Applications:</h3>
      <ul>
        {applications.map((application, index) => (
          <li key={index}>
            <p>Company: {application.company}</p>
            <p>Position: {application.position}</p>
            <p>Country: {application.country}</p>
            <p>Experience: {application.experience}</p>
            <p>Feedback Time: {application.feedbackTime} weeks</p>
            <p>Highest Degree: {application.degree}</p>
            <p>Application Source: {application.applicationSource}</p>
            <p>Position Posting Duration: {application.listingDuration} week{application.listingDuration > 1 ? 's' : ''}</p>
            <p>Salary Expectation: ${application.salaryExpectation}</p>
            <p>Application Status: {application.ApplicationStatus}</p>
          </li>
        ))}
      </ul>

      <div className="pagination">
        {Array.from({ length: Math.ceil(totalApplications / limit) }, (_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tracker;
