import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectHits } from 'react-instantsearch-dom';
import CustomSearchBox from './CustomSearchBox';
import { countries, applicationSources, degrees, applicationStatuses, listingDurations } from './constants';

// Initialize the Algolia client with your App ID and API key
const searchClient = algoliasearch('21GLO4JOBR', '40ade772c34eddda66c63b5e75436e35');

// Create a connected version of Hits to pass data to the CustomSearchBox
const CustomHits = connectHits(({ hits, onNewCompany }) => (
  <CustomSearchBox hits={hits} onNewCompany={onNewCompany} />
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
  });

  const [searchQuery, setSearchQuery] = useState('');

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
    setApplications([...applications, form]);
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
    });
  };

  const handleCompanySelect = (company) => {
    setForm({ ...form, company });
    setSearchQuery(''); // Clear search query after selection
  };

  return (
    <div className="Tracker">
      <h2>Application Tracker</h2>
      <form onSubmit={handleSubmit}>
        {/* Company Name Search */}
        <label>Company Name:</label>
        <InstantSearch indexName="companies" searchClient={searchClient}>
          <CustomHits onNewCompany={handleCompanySelect} />
        </InstantSearch>

        {/* Other fields */}
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

        <label>Feedback Time (in weeks):</label>
        <input
          type="range"
          name="feedbackTime"
          min="0"
          max="10"
          value={form.feedbackTime}
          onChange={handleSliderChange}
        />
        <span>{form.feedbackTime} weeks</span>

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

      {/* Tracked Applications */}
      <h3>Tracked Applications:</h3>
      <ul>
        {applications.map((application, index) => (
          <li key={index}>
            <p>Company: {application.company}</p>
            <p>Position: {application.position}</p>
            <p>Country: {application.country}</p>
            <p>Feedback Time: {application.feedbackTime} weeks</p>
            <p>Highest Degree: {application.degree}</p>
            <p>Application Source: {application.applicationSource}</p>
            <p>Position Posting Duration: {application.listingDuration} week{application.listingDuration > 1 ? 's' : ''}</p>
            <p>Salary Expectation: ${application.salaryExpectation}</p>
            <p>Application Status: {application.ApplicationStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tracker;
