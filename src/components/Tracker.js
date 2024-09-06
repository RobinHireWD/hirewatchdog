import React, { useState } from 'react';

function Tracker() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    company: '',
    position: '',
    location: '',
    feedbackTime: '',
    outcome: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApplications([...applications, form]);
    setForm({
      company: '',
      position: '',
      location: '',
      feedbackTime: '',
      outcome: ''
    });
  };

  return (
    <div className="Tracker">
      <h2>Application Tracker</h2>
      <form onSubmit={handleSubmit}>
        <label>Company Name:</label>
        <input type="text" name="company" value={form.company} onChange={handleChange} required />

        <label>Position Applied:</label>
        <input type="text" name="position" value={form.position} onChange={handleChange} required />

        <label>Location:</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} required />

        <label>Feedback Time (in days):</label>
        <input type="number" name="feedbackTime" value={form.feedbackTime} onChange={handleChange} required />

        <label>Outcome:</label>
        <input type="text" name="outcome" value={form.outcome} onChange={handleChange} required />

        <button type="submit">Add Application</button>
      </form>

      <h3>Tracked Applications:</h3>
      <ul>
        {applications.map((application, index) => (
          <li key={index}>
            <p>Company: {application.company}</p>
            <p>Position: {application.position}</p>
            <p>Location: {application.location}</p>
            <p>Feedback Time: {application.feedbackTime} days</p>
            <p>Outcome: {application.outcome}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tracker;
