import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Hits } from 'react-instantsearch-dom';
import CustomSearchBox from './CustomSearchBox';

// Initialize the Algolia client with your App ID and API key
const searchClient = algoliasearch('21GLO4JOBR', '40ade772c34eddda66c63b5e75436e35');
const index = searchClient.initIndex('companies');

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

  const getFeedbackDescription = (weeks) => {
    if (weeks <= 2) return 'Quick';
    if (weeks <= 4) return 'Average';
    if (weeks <= 6) return 'Slow';
    return 'Extremely Slow';
  };
  // List of countries
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
    'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic (CAR)',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo',
    'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini',
    'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
    'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua',
    'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
    'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
    'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // List of application sources
  const applicationSources = [
    "Company's Website", "LinkedIn", "Indeed", "Glassdoor", "Monster", "Recruitment Agency", "Employee Referral", "Job Fair", 
    "University Career Center", "Other"
  ];

  // List of listing durations
  const listingDurations = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div className="Tracker">
      <h2>Application Tracker</h2>
      <form onSubmit={handleSubmit}>
        <label>Company Name:</label>
        <InstantSearch indexName="companies" searchClient={searchClient}>
          <CustomSearchBox
            onNewCompany={(company) => setForm({ ...form, company })}
          />
          <Hits hitComponent={Hit} />
        </InstantSearch>

        <label>Position Applied:</label>
        <input type="text" name="position" value={form.position} onChange={handleChange} required />

        <label>Country:</label>
        <select name="country" value={form.country} onChange={handleChange} required>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <label>Feedback Time (in weeks): {getFeedbackDescription(form.feedbackTime)}</label>
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
          <option value="High School">High School</option>
          <option value="Associate's">Associate's</option>
          <option value="Bachelor's">Bachelor's</option>
          <option value="Master's">Master's</option>
          <option value="PhD">PhD</option>
        </select>

        <label>Application Source:</label>
        <select name="applicationSource" value={form.applicationSource} onChange={handleChange} required>
          <option value="">Select Source</option>
          {applicationSources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>

        <label>Position Posting Duration (in weeks):</label>
        <select name="listingDuration" value={form.listingDuration} onChange={handleChange}>
          <option value="">Select Duration</option>
          {listingDurations.map((week) => (
            <option key={week} value={week}>
              {week} week{week > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <label>Salary Expectation (Annual in USD):</label>
        <input type="number" name="salaryExpectation" value={form.salaryExpectation} onChange={handleChange} placeholder="e.g., 60000" required />

        <label>Application Status:</label>
        <select name="ApplicationStatus" value={form.ApplicationStatus} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Hired">Hired</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Rejected After Interview">Rejected After Interview</option>
          <option value="Rejected Without Interview">Rejected Without Interview</option>
          <option value="Ghosted">Ghosted</option>
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
    <p>{hit.name}</p> {/* Ensure this matches your Algolia record structure */}
  </div>
);

export default Tracker;