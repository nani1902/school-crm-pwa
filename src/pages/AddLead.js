import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateLead } from '../hooks/useLeads';
import './AddLead.css';

const AddLead = () => {
  const navigate = useNavigate();
  const { mutate: createLead, isLoading, isError, error } = useCreateLead();
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    parent_name: '',
    area_of_residence: '',
    date_of_enquiry: new Date().toISOString().split('T')[0], // Today's date
    source: '',
    interested_class: '',
    notes: ''
  });
  
  // Error handling
  const [formErrors, setFormErrors] = useState({});
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
    if (!formData.date_of_enquiry) errors.date_of_enquiry = 'Date of enquiry is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Process interested_class to match API expectations
    let submissionData = {...formData};
    if (submissionData.interested_class) {
      submissionData.interested_class_id = submissionData.interested_class;
      delete submissionData.interested_class;
    }
    
    createLead(submissionData, {
      onSuccess: (data) => {
        // Navigate to the detail page of the newly created lead
        navigate(`/leads/${data.id}`);
      },
      onError: (error) => {
        console.error('Error creating lead:', error);
        
        // Handle API validation errors
        if (error.response?.data) {
          const apiErrors = error.response.data;
          const formattedErrors = {};
          
          // Convert API errors to our form error format
          Object.keys(apiErrors).forEach(key => {
            formattedErrors[key] = Array.isArray(apiErrors[key]) 
              ? apiErrors[key].join(' ') 
              : apiErrors[key];
          });
          
          setFormErrors(formattedErrors);
        }
      }
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Add New Lead</h1>
        <div className="header-actions">
          <Link to="/leads" className="btn btn-outline-secondary">
            <span className="material-icons">arrow_back</span>
            <span className="btn-text">Back to Leads</span>
          </Link>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3>Lead Information</h3>
        </div>
        <div className="card-body">
          {isError && (
            <div className="alert alert-danger mb-4">
              {error?.message || 'An error occurred while creating the lead. Please try again.'}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* First Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label">Student First Name*</label>
                <input 
                  type="text"
                  id="first_name"
                  name="first_name"
                  className={`form-control ${formErrors.first_name ? 'is-invalid' : ''}`}
                  value={formData.first_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.first_name && (
                  <div className="invalid-feedback d-block">
                    {formErrors.first_name}
                  </div>
                )}
              </div>
              
              {/* Last Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label">Student Last Name*</label>
                <input 
                  type="text"
                  id="last_name"
                  name="last_name"
                  className={`form-control ${formErrors.last_name ? 'is-invalid' : ''}`}
                  value={formData.last_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.last_name && (
                  <div className="invalid-feedback d-block">
                    {formErrors.last_name}
                  </div>
                )}
              </div>
              
              {/* Parent Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="parent_name" className="form-label">Parent/Guardian Name</label>
                <input 
                  type="text"
                  id="parent_name"
                  name="parent_name"
                  className={`form-control ${formErrors.parent_name ? 'is-invalid' : ''}`}
                  value={formData.parent_name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.parent_name && (
                  <div className="invalid-feedback d-block">
                    {formErrors.parent_name}
                  </div>
                )}
              </div>
              
              {/* Phone Number */}
              <div className="col-md-6 mb-3">
                <label htmlFor="phone_number" className="form-label">Phone Number*</label>
                <input 
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  className={`form-control ${formErrors.phone_number ? 'is-invalid' : ''}`}
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.phone_number && (
                  <div className="invalid-feedback d-block">
                    {formErrors.phone_number}
                  </div>
                )}
              </div>
              
              {/* Email */}
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.email && (
                  <div className="invalid-feedback d-block">
                    {formErrors.email}
                  </div>
                )}
              </div>
              
              {/* Area of Residence */}
              <div className="col-md-6 mb-3">
                <label htmlFor="area_of_residence" className="form-label">Area of Residence</label>
                <input 
                  type="text"
                  id="area_of_residence"
                  name="area_of_residence"
                  className={`form-control ${formErrors.area_of_residence ? 'is-invalid' : ''}`}
                  value={formData.area_of_residence}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.area_of_residence && (
                  <div className="invalid-feedback d-block">
                    {formErrors.area_of_residence}
                  </div>
                )}
              </div>
              
              {/* Date of Enquiry */}
              <div className="col-md-6 mb-3">
                <label htmlFor="date_of_enquiry" className="form-label">Date of Enquiry*</label>
                <input 
                  type="date"
                  id="date_of_enquiry"
                  name="date_of_enquiry"
                  className={`form-control ${formErrors.date_of_enquiry ? 'is-invalid' : ''}`}
                  value={formData.date_of_enquiry}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {formErrors.date_of_enquiry && (
                  <div className="invalid-feedback d-block">
                    {formErrors.date_of_enquiry}
                  </div>
                )}
              </div>
              
              {/* Source */}
              <div className="col-md-6 mb-3">
                <label htmlFor="source" className="form-label">Source</label>
                <select
                  id="source"
                  name="source"
                  className={`form-control ${formErrors.source ? 'is-invalid' : ''}`}
                  value={formData.source}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="">-- Select Source --</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Newspaper">Newspaper</option>
                  <option value="Call">Call</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.source && (
                  <div className="invalid-feedback d-block">
                    {formErrors.source}
                  </div>
                )}
              </div>
              
              {/* Interested Class */}
              <div className="col-md-6 mb-3">
                <label htmlFor="interested_class" className="form-label">Interested Class</label>
                <select
                  id="interested_class"
                  name="interested_class"
                  className={`form-control ${formErrors.interested_class ? 'is-invalid' : ''}`}
                  value={formData.interested_class}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="">-- Select Class --</option>
                  <option value="1">Nursery</option>
                  <option value="2">LKG</option>
                  <option value="3">UKG</option>
                  <option value="4">1st Grade</option>
                  <option value="5">2nd Grade</option>
                  <option value="6">3rd Grade</option>
                  <option value="7">4th Grade</option>
                  <option value="8">5th Grade</option>
                </select>
                {formErrors.interested_class && (
                  <div className="invalid-feedback d-block">
                    {formErrors.interested_class}
                  </div>
                )}
              </div>
              
              {/* Notes */}
              <div className="col-12 mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className={`form-control ${formErrors.notes ? 'is-invalid' : ''}`}
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={isLoading}
                ></textarea>
                {formErrors.notes && (
                  <div className="invalid-feedback d-block">
                    {formErrors.notes}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 d-flex justify-content-end">
              <Link to="/leads" className="btn btn-outline-secondary me-2">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLead;