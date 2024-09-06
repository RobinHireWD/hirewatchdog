import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits, connectHits } from 'react-instantsearch-dom'; // Ensure Hits is imported
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

  return (
    <div className="Tracker">
      <h2>Application Tracker</h2>
      <form onSubmit={handleSubmit}>
        <label>Company Name:</label>
        <InstantSearch indexName="companies" searchClient={searchClient}>
          {/* Pass the hits to the CustomSearchBox via CustomHits */}
          <CustomHits onNewCompany={(company) => setForm({ ...form, company })} />
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

        {/* Other form inputs remain unchanged */}
        <button type="submit">Add Application</button>
      </form>

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

// Component to render individual hits
const Hit = ({ hit }) => (
  <div>
    <p>{hit.name}</p>
  </div>
);

export default Tracker;

