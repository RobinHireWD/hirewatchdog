import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectHits } from 'react-instantsearch-dom';
import CustomSearchBox from './CustomSearchBox';
import {
  countries,
  applicationSources,
  degrees,
  applicationStatuses,
} from './constants';
import './Tracker.css';

const searchClient = algoliasearch('21GLO4JOBR', '40ade772c34eddda66c63b5e75436e35');

const CustomHits = connectHits(({ hits, onNewCompany }) => (
  <CustomSearchBox hits={hits} onNewCompany={onNewCompany} isSuggestionsVisible={true} />
));

const capitalizeEachWord = (string) => {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

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
    listingduration: 1,
    experience: '',
  });

  const [isSuggestionsVisible, setSuggestionsVisible] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/applications?page=1&limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications); // Store fetched applications
      })
      .catch((error) => console.error('Error fetching applications:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === 'company' || name === 'position'
      ? capitalizeEachWord(value)
      : name === 'salaryexpectation'
      ? Math.max(0, value)
      : value;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: formattedValue,
    }));
  };

  const handleSliderChange = (e) => {
    setForm({
      ...form,
      feedbacktime: e.target.value,
    });
  };

  const handleListingDurationChange = (e) => {
    setForm({
      ...form,
      listingduration: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const company = capitalizeEachWord(form.company);

    fetch('http://localhost:5001/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, company }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setApplications([...applications, data]); // Store new application data
          setForm({
            company: '',
            position: '',
            country: '',
            feedbacktime: 0,
            degree: '',
            applicationsource: '',
            salaryexpectation: '',
            applicationstatus: '',
            listingduration: 1,
            experience: '',
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
    setForm({ ...form, company: capitalizeEachWord(company) });
    setSuggestionsVisible(false); // Hide suggestions when a company is selected
  };

  const handleCountrySelect = (e) => {
    setForm({ ...form, country: e.target.value });
    setSuggestionsVisible(false); // Hide suggestions when a country is selected
  };

  const getFeedbackLabel = (value) => {
    if (value <= 2) return 'Quick';
    if (value <= 5) return 'Moderate';
    if (value <= 7) return 'Slow';
    return 'Very Slow';
  };

  const getListingDurationLabel = (value) => {
    if (value <= 5) return 'Short';
    if (value <= 10) return 'Medium';
    if (value <= 15) return 'Long';
    return 'Very Long';
  };

  return (
    <div className="Tracker">
      <h2>Tell Us About Your Experience</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Application Details</h3>
        </div>

        {/* Company and Position in one row */}
        <div className="form-row">
          <div className="form-group">
            <label>Company Name:</label>
            <InstantSearch indexName="companies" searchClient={searchClient}>
              <CustomHits onNewCompany={handleCompanySelect} isSuggestionsVisible={isSuggestionsVisible} />
            </InstantSearch>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Or Enter New Company Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              className="input-field"
              placeholder="Position Applied For"
              required
            />
          </div>
        </div>

        {/* Country and Experience in one row */}
        <div className="form-row">
          <div className="form-group">
            <label>Country:</label>
            <select name="country" value={form.country} onChange={handleCountrySelect} required className="select-field">
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Experience in the Field (years):</label>
            <select name="experience" value={form.experience} onChange={handleChange} className="select-field">
              <option value="">Select Experience</option>
              <option value="0-2">0-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10-20">10-20 years</option>
            </select>
          </div>
        </div>

        {/* Degree and Salary Expectation in one row */}
        <div className="form-row">
          <div className="form-group">
            <label>Degree:</label>
            <select name="degree" value={form.degree} onChange={handleChange} required className="select-field">
              <option value="">Select Degree</option>
              {degrees.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Salary Expectation (in USD):</label>
            <input
              type="number"
              name="salaryexpectation"
              value={form.salaryexpectation}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter Salary Expectation"
              required
              min="0"
            />
          </div>
        </div>

        {/* Application Source and Status in one row */}
        <div className="form-row">
          <div className="form-group">
            <label>Application Source:</label>
            <select
              name="applicationsource"
              value={form.applicationsource}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Select Source</option>
              {applicationSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Application Status:</label>
            <select
              name="applicationstatus"
              value={form.applicationstatus}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Select Status</option>
              {applicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feedback Time */}
        <div className="form-group">
          <label>Feedback or Waiting Time (in weeks):</label>
          <span className="feedback-label">{getFeedbackLabel(form.feedbacktime)}</span>
          <div className="slider-wrapper">
            <div className="range-container">
              <input
                type="range"
                min="0"
                max="12"
                value={form.feedbacktime}
                onChange={handleSliderChange}
              />
              <span>{form.feedbacktime} weeks</span>
            </div>
          </div>
        </div>

        {/* Listing Duration */}
        <div className="form-group">
          <label>Listing Duration (in weeks):</label>
          <span className="listing-duration-label">{getListingDurationLabel(form.listingduration)}</span>
          <div className="form-group">
            <div className="slider-wrapper">
              <div className="range-container">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={form.listingduration}
                  onChange={handleListingDurationChange}
                />
                <span>{form.listingduration} weeks</span>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
  );
}

export default Tracker;
