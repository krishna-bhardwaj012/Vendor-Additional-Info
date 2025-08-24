/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// import '../style/VendorBook.css';

const totalSteps = 6; // You can adjust as needed

// Simple placeholder shown when no preview image is available
const PlaceholderIcon = () => (
  <div
    style={{
      width: 90,
      height: 70,
      border: '1px dashed #9aa0a6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      fontSize: 12,
      color: '#5f6368',
      background: '#f8f9fa'
    }}
  >
    Upload
  </div>
);

const VendorBook = () => {
  const [step, setStep] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loadingButton, setLoadingButton] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [formFields, setFormFields] = useState({
    VEND_LOGO: '',
    IMAGE: '',
    VEND_TITL: '',
    VEND_CON_ADDR: '',
    VEND_CATEGRY: '',
    VEND_DET: '',
    VEND_STATUS: '',
    VEND_SOURCE: '',
    email: '',
    phone: '',
    COUNTRY: '',
    STATE: '',
    CITY: '',
    pincode: '',
    VEND_IND_INF: '',
    RANKING: '',
    DOC_PRICE: '',
    INDUSTRY_TYPE: '',
    BUSINESS_TYPE: '',
    KEYWORDS: '',
    PORTAL_RANKING: '',
    STATE_RANKING: '',
    CITY_RANKING: '',
    MYBLOCK_RANKING_TYPE: '',
    MYBLOCK_RANKING_NUMBER: '',
    PREVIOUS_RANKING: '',
    REVENUE: '',
    REVENUE_GROWTH: '',
    EMPLOYEE_COUNT: '',
    EMP_GROWTH: '',
    JOB_OPENINGS: '',
    COMPANY_NAME: '',
    VENDOR_LEVEL: '',
    LEAD_INVESTORS: '',
    ESTIMATED_REVENUES: '',
    ACCELERATOR: '',
    FUNDING: '',
    TOTAL_FUNDING: '',
    SP_COPY_IGNORE: '',
    COMMENTS_SUMMARY: '',
    VEND_DESC: '',
    VEND_KEY_NO: '',
    VEND_COMPT: '',
    VEND_FINAN_OVIEW: '',
    other_emails: '',
    other_phones: '',
    address: '',
    MOBILE_PHONE: '',
    PRIMARY_CONTACT_PERSON: '',
    VALUATION: '',
    VEND_URL: '',
    LINKEDIN_URL: '',
    PRODUCT_URL: '',
    INDEED_URL: '',
    VEND_CNTR: '',
    FOUNDED_YEAR: '',
    FB_PAGE_URL: '',
    INSTA_PAGE_URL: '',
    LINKEDIN_PAGE_URL: '',
    FB_FOLLOWER_COUNT: '',
    INSTA_FOLLOWER_COUNT: '',
    LINKEDIN_FOLLOWER_COUNT: '',
  });

  const logoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleLogoClick = () => logoInputRef.current?.click();
  const handleImageClick = () => imageInputRef.current?.click();

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
        setError('');
      } else {
        Swal.fire('File Too Large', 'Logo must be less than 10MB.', 'error');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError('');
      } else {
        Swal.fire('File Too Large', 'Image must be less than 10MB.', 'error');
      }
    }
  };

  const handleInputChange = (e) => {
    const { placeholder, value } = e.target;
    const fieldMap = {
      "Upload Logo": "VEND_LOGO",
      "Upload Image": "IMAGE",
      "Enter Vendor Title": "VEND_TITL",
      "Enter Vendor Contact Address": "VEND_CON_ADDR",
      "Enter Vendor Category": "VEND_CATEGRY",
      "Enter Vendor Detail": "VEND_DET",
      "Enter Vendor Status": "VEND_STATUS",
      "Enter Vendor Source": "VEND_SOURCE",
      "Enter Email": "email",
      "Enter Phone Number": "phone",
      "Enter Country": "COUNTRY",
      "Enter State": "STATE",
      "Enter City": "CITY",
      "Enter Pincode": "pincode",
      "Enter Vendor Information": "VEND_IND_INF",
      "Enter Ranking": "RANKING",
      "Enter Document Price": "DOC_PRICE",
      "Enter Industry Type": "INDUSTRY_TYPE",
      "Enter Business Type": "BUSINESS_TYPE",
      "Enter Keyword": "KEYWORDS",
      "Enter Portal Ranking": "PORTAL_RANKING",
      "Enter State Ranking": "STATE_RANKING",
      "Enter City Ranking": "CITY_RANKING",
      "Enter Myblock Ranking Type": "MYBLOCK_RANKING_TYPE",
      "Enter Myblock Ranking Number": "MYBLOCK_RANKING_NUMBER",
      "Enter Previous Ranking": "PREVIOUS_RANKING",
      "Enter Revenu": "REVENUE",
      "Enter Revenu Growth": "REVENUE_GROWTH",
      "Enter Employee Count": "EMPLOYEE_COUNT",
      "Enter Employee Growth": "EMP_GROWTH",
      "Enter Job Opening": "JOB_OPENINGS",
      "Enter Company Name": "COMPANY_NAME",
      "Enter Vendor Level": "VENDOR_LEVEL",
      "Enter Lead Investors": "LEAD_INVESTORS",
      "Enter Estimated Revenue": "ESTIMATED_REVENUES",
      "Enter Accelator": "ACCELERATOR",
      "Enter Funding": "FUNDING",
      "Enter Total Funding": "TOTAL_FUNDING",
      "Enter SP Copy Ignore": "SP_COPY_IGNORE",
      "Enter Comment Summary": "COMMENTS_SUMMARY",
      "Enter Vendor Description": "VEND_DESC",
      "Enter Vendor Key Number": "VEND_KEY_NO",
      "Enter Vendor Component": "VEND_COMPT",
      "Enter Vendor Final Overview": "VEND_FINAN_OVIEW",
      "Enter Other Email": "other_emails",
      "Enter Other Phone": "other_phones",
      "Enter Address": "address",
      "Enter Mobile/Phone": "MOBILE_PHONE",
      "Enter Primary Contact Person": "PRIMARY_CONTACT_PERSON",
      "Enter Valuation": "VALUATION",
      "Enter Vendor URL": "VEND_URL",
      "Enter Linkedin URL": "LINKEDIN_URL",
      "Enter Product URL": "PRODUCT_URL",
      "Enter Indeed URL": "INDEED_URL",
      "Enter Vendor Control": "VEND_CNTR",
      "Enter Founded Year": "FOUNDED_YEAR",
      "Enter Facebook Page URL": "FB_PAGE_URL",
      "Enter Instagram Page URL": "INSTA_PAGE_URL",
      "Enter Linkedin Page URL": "LINKEDIN_PAGE_URL",
      "Enter Facebook Follower Count": "FB_FOLLOWER_COUNT",
      "Enter Instagram Follower Count": "INSTA_FOLLOWER_COUNT",
      "Enter Linkedin Follower Count": "LINKEDIN_FOLLOWER_COUNT"
    };
    const fieldName = fieldMap[placeholder];
    setFormFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setLoadingButton('next');
      setTimeout(() => {
        setLoadingButton(null);
        setStep(prev => prev + 1);
      }, 500);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step > 1) {
      setLoadingButton('back');
      setTimeout(() => {
        setLoadingButton(null);
        setStep(prev => prev - 1);
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (logoFile) formData.append('logo', logoFile);
    if (imageFile) formData.append('image', imageFile);
    for (const key in formFields) formData.append(key, formFields[key]);

    const result = await Swal.fire({
      title: 'Are you Sure?',
      text: 'Do you want to Submit the Form?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#00ff00',
      cancelButtonColor: '#ff0000',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post('http://localhost:5000/api/kf_vendor', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Success:', response.data);
        setLoading(false);
        Swal.fire('Success', 'Vendor Form Submit Successfully!', 'success');
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        Swal.fire('Error', 'Failed to Submit Vendor Data.', 'error');
      }
    } else {
      setLoading(false);
      Swal.fire('Cancelled', 'Vendor Form Submission Canceled', 'info');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <span className="title">Upload Vendor Logo & Image:</span>

            <div className="images">
              {/* Upload Logo */}
              <div className="fields">
                <div className="image-field">
                  <label>Upload Logo</label>
                  <div className="upload-container" onClick={handleLogoClick}>
                    <p>Drag file(s) here to upload Vendor Logo.</p>
                    <p>Alternatively, you can select a file by</p>
                    <p className="click-text">clicking here</p>

                    <div className="upload-icon">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="preview" />
                      ) : (
                        <PlaceholderIcon />
                      )}
                    </div>

                    {error && <p className="error">{error}</p>}
                    <p className="files"><span>Supported files:</span> .jpg, .jpeg, .png</p>
                    <p className="files"><span>Max file size:</span> 10MB</p>

                    <input
                      type="file"
                      placeholder="Upload Logo"
                      accept="image/*"
                      ref={logoInputRef}
                      onChange={handleLogoChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Image */}
              <div className="fields">
                <div className="image-field">
                  <label>Upload Image</label>
                  <div className="upload-container" onClick={handleImageClick}>
                    <p>Drag file(s) here to upload Vendor Image.</p>
                    <p>Alternatively, you can select a file by</p>
                    <p className="click-text">clicking here</p>

                    <div className="upload-icon">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Image Preview" className="preview" />
                      ) : (
                        <PlaceholderIcon />
                      )}
                    </div>

                    {error && <p className="error">{error}</p>}
                    <p className="files"><span>Supported files:</span> .jpg, .jpeg, .png</p>
                    <p className="files"><span>Max file size:</span> 10MB</p>

                    <input
                      type="file"
                      placeholder="Upload Image"
                      accept="image/*"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="button-container">
              <button className="nextBtn1" onClick={handleNext} disabled={loadingButton === 'next'}>
                <span className="btnText">{loadingButton === 'next' ? 'Loading...' : 'Next'}</span>
                <i className="uil uil-navigator"></i>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <div className="details address">
              <span className="title">Vendor Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Vendor Title</label>
                  <input type="text" placeholder="Enter Vendor Title" value={formFields.VEND_TITL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Contact Address</label>
                  <input type="text" placeholder="Enter Vendor Contact Address" value={formFields.VEND_CON_ADDR} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Category</label>
                  <input type="text" placeholder="Enter Vendor Category" value={formFields.VEND_CATEGRY} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Detail</label>
                  <input type="text" placeholder="Enter Vendor Detail" value={formFields.VEND_DET} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Status</label>
                  <input type="number" placeholder="Enter Vendor Status" value={formFields.VEND_STATUS} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Source</label>
                  <input type="text" placeholder="Enter Vendor Source" value={formFields.VEND_SOURCE} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="details family">
              <span className="title">Contact Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Email</label>
                  <input type="text" placeholder="Enter Email" value={formFields.email} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Phone Number</label>
                  <input type="text" placeholder="Enter Phone Number" value={formFields.phone} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Country</label>
                  <input type="text" placeholder="Enter Country" value={formFields.COUNTRY} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>State</label>
                  <input type="text" placeholder="Enter State" value={formFields.STATE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>City</label>
                  <input type="text" placeholder="Enter City" value={formFields.CITY} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Pincode</label>
                  <input type="number" placeholder="Enter Pincode" value={formFields.pincode} onChange={handleInputChange} />
                </div>
              </div>

              <div className="button-container">
                <button className="backBtn" onClick={handleBack} disabled={loadingButton === 'back'}>
                  <i className="uil uil-navigator rotated-icon"></i>
                  <span className="btnText">{loadingButton === 'back' ? 'Loading...' : 'Back'}</span>
                </button>
                <button className="nextBtn" onClick={handleNext} disabled={loadingButton === 'next'}>
                  <span className="btnText">{loadingButton === 'next' ? 'Loading...' : 'Next'}</span>
                  <i className="uil uil-navigator"></i>
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <div className="details id">
              <span className="title">Type Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Vendor Information</label>
                  <input type="text" placeholder="Enter Vendor Information" value={formFields.VEND_IND_INF} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Ranking</label>
                  <input type="number" placeholder="Enter Ranking" value={formFields.RANKING} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Document Price</label>
                  <input type="number" placeholder="Enter Document Price" value={formFields.DOC_PRICE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Industry Type</label>
                  <input type="text" placeholder="Enter Industry Type" value={formFields.INDUSTRY_TYPE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Business Type</label>
                  <input type="text" placeholder="Enter Business Type" value={formFields.BUSINESS_TYPE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Keyword</label>
                  <input type="text" placeholder="Enter Keyword" value={formFields.KEYWORDS} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="details ranking">
              <span className="title">Ranking Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Portal Ranking</label>
                  <input type="text" placeholder="Enter Portal Ranking" value={formFields.PORTAL_RANKING} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>State Ranking</label>
                  <input type="text" placeholder="Enter State Ranking" value={formFields.STATE_RANKING} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>City Ranking</label>
                  <input type="text" placeholder="Enter City Ranking" value={formFields.CITY_RANKING} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Myblock Ranking Type</label>
                  <input type="text" placeholder="Enter Myblock Ranking Type" value={formFields.MYBLOCK_RANKING_TYPE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Myblock Ranking Number</label>
                  <input type="number" placeholder="Enter Myblock Ranking Number" value={formFields.MYBLOCK_RANKING_NUMBER} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Previous Ranking</label>
                  <input type="number" placeholder="Enter Previous Ranking" value={formFields.PREVIOUS_RANKING} onChange={handleInputChange} />
                </div>
              </div>

              <div className="button-container">
                <button className="backBtn" onClick={handleBack} disabled={loadingButton === 'back'}>
                  <i className="uil uil-navigator rotated-icon"></i>
                  <span className="btnText">{loadingButton === 'back' ? 'Loading...' : 'Back'}</span>
                </button>
                <button className="nextBtn" onClick={handleNext} disabled={loadingButton === 'next'}>
                  <span className="btnText">{loadingButton === 'next' ? 'Loading...' : 'Next'}</span>
                  <i className="uil uil-navigator"></i>
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <div className="details growth">
              <span className="title">Growth Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Revenu</label>
                  <input type="text" placeholder="Enter Revenu" value={formFields.REVENUE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Revenu Growth</label>
                  <input type="text" placeholder="Enter Revenu Growth" value={formFields.REVENUE_GROWTH} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Employee Count</label>
                  <input type="text" placeholder="Enter Employee Count" value={formFields.EMPLOYEE_COUNT} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Employee Growth</label>
                  <input type="text" placeholder="Enter Employee Growth" value={formFields.EMP_GROWTH} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Job Opening</label>
                  <input type="text" placeholder="Enter Job Opening" value={formFields.JOB_OPENINGS} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Company Name</label>
                  <input type="text" placeholder="Enter Company Name" value={formFields.COMPANY_NAME} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="details level">
              <span className="title">Level Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Vendor Level</label>
                  <input type="text" placeholder="Enter Vendor Level" value={formFields.VENDOR_LEVEL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Lead Investors</label>
                  <input type="text" placeholder="Enter Lead Investors" value={formFields.LEAD_INVESTORS} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Estimated Revenue</label>
                  <input type="number" placeholder="Enter Estimated Revenue" value={formFields.ESTIMATED_REVENUES} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Accelator</label>
                  <input type="text" placeholder="Enter Accelator" value={formFields.ACCELERATOR} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Funding</label>
                  <input type="text" placeholder="Enter Funding" value={formFields.FUNDING} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Total Funding</label>
                  <input type="number" placeholder="Enter Total Funding" value={formFields.TOTAL_FUNDING} onChange={handleInputChange} />
                </div>
              </div>

              <div className="button-container">
                <button className="backBtn" onClick={handleBack} disabled={loadingButton === 'back'}>
                  <i className="uil uil-navigator rotated-icon"></i>
                  <span className="btnText">{loadingButton === 'back' ? 'Loading...' : 'Back'}</span>
                </button>
                <button className="nextBtn" onClick={handleNext} disabled={loadingButton === 'next'}>
                  <span className="btnText">{loadingButton === 'next' ? 'Loading...' : 'Next'}</span>
                  <i className="uil uil-navigator"></i>
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <div className="details key">
              <span className="title">Vendor key Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>SP Copy Ignore</label>
                  <input type="number" placeholder="Enter SP Copy Ignore" value={formFields.SP_COPY_IGNORE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Comment Summary</label>
                  <input type="text" placeholder="Enter Comment Summary" value={formFields.COMMENTS_SUMMARY} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Description</label>
                  <input type="text" placeholder="Enter Vendor Description" value={formFields.VEND_DESC} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Key Number</label>
                  <input type="number" placeholder="Enter Vendor Key Number" value={formFields.VEND_KEY_NO} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Component</label>
                  <input type="text" placeholder="Enter Vendor Component" value={formFields.VEND_COMPT} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Final Overview</label>
                  <input type="text" placeholder="Enter Vendor Final Overview" value={formFields.VEND_FINAN_OVIEW} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="details level">
              <span className="title">Alternative Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Other Email</label>
                  <input type="text" placeholder="Enter Other Email" value={formFields.other_emails} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Other Phone</label>
                  <input type="text" placeholder="Enter Other Phone" value={formFields.other_phones} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Address</label>
                  <input type="text" placeholder="Enter Address" value={formFields.address} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Mobile/Phone</label>
                  <input type="text" placeholder="Enter Mobile/Phone" value={formFields.MOBILE_PHONE} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Primary Contact Person</label>
                  <input type="text" placeholder="Enter Primary Contact Person" value={formFields.PRIMARY_CONTACT_PERSON} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Valuation</label>
                  <input type="text" placeholder="Enter Valuation" value={formFields.VALUATION} onChange={handleInputChange} />
                </div>
              </div>

              <div className="button-container">
                <button className="backBtn" onClick={handleBack} disabled={loadingButton === 'back'}>
                  <i className="uil uil-navigator rotated-icon"></i>
                  <span className="btnText">{loadingButton === 'back' ? 'Loading...' : 'Back'}</span>
                </button>
                <button className="nextBtn" onClick={handleNext} disabled={loadingButton === 'next'}>
                  <span className="btnText">{loadingButton === 'next' ? 'Loading...' : 'Next'}</span>
                  <i className="uil uil-navigator"></i>
                </button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-step">
            <div className="details key">
              <span className="title">URLs Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Vendor URL</label>
                  <input type="text" placeholder="Enter Vendor URL" value={formFields.VEND_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Linkedin URL</label>
                  <input type="text" placeholder="Enter Linkedin URL" value={formFields.LINKEDIN_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Product URL</label>
                  <input type="text" placeholder="Enter Product URL" value={formFields.PRODUCT_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Indeed URL</label>
                  <input type="text" placeholder="Enter Indeed URL" value={formFields.INDEED_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Vendor Control</label>
                  <input type="text" placeholder="Enter Vendor Control" value={formFields.VEND_CNTR} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Founded Year</label>
                  <input type="number" placeholder="Enter Founded Year" value={formFields.FOUNDED_YEAR} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="details level">
              <span className="title">Page URLs & Follower Count Details:-</span>
              <div className="fields">
                <div className="input-field">
                  <label>Facebook Page URL</label>
                  <input type="text" placeholder="Enter Facebook Page URL" value={formFields.FB_PAGE_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Instagram Page URL</label>
                  <input type="text" placeholder="Enter Instagram Page URL" value={formFields.INSTA_PAGE_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Linkedin Page URL</label>
                  <input type="text" placeholder="Enter Linkedin Page URL" value={formFields.LINKEDIN_PAGE_URL} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Facebook Follower Count</label>
                  <input type="number" placeholder="Enter Facebook Follower Count" value={formFields.FB_FOLLOWER_COUNT} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Instagram Follower Count</label>
                  <input type="number" placeholder="Enter Instagram Follower Count" value={formFields.INSTA_FOLLOWER_COUNT} onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Linkedin Follower Count</label>
                  <input type="number" placeholder="Enter Linkedin Follower Count" value={formFields.LINKEDIN_FOLLOWER_COUNT} onChange={handleInputChange} />
                </div>
              </div>

              <div className="button-container">
                <button className="backBtn" onClick={handleBack} disabled={loadingButton === 'back'}>
                  <i className="uil uil-navigator rotated-icon"></i>
                  <span className="btnText">{loadingButton === 'back' ? 'Loading...' : 'Back'}</span>
                </button>
                <button className="submitBtn" onClick={handleSubmit} disabled={loading}>
                  <span className="btnText">{loading ? 'Loading...' : 'Submit'}</span>
                  <i className="uil uil-database"></i>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="stepper-container">
        {[...Array(totalSteps)].map((_, index) => {
          const currentStep = index + 1;
          return (
            <React.Fragment key={currentStep}>
              <div className={`step ${step > currentStep ? 'completed' : ''} ${step === currentStep ? 'active' : ''}`}>
                {step > currentStep ? '✔' : currentStep}
              </div>
              {currentStep !== totalSteps && <div className={`line ${step > currentStep ? 'active' : ''}`}></div>}
            </React.Fragment>
          );
        })}
      </div>

      <div className="vendor-book-container">
        <form onSubmit={handleSubmit}>
          <div className="form-container">{renderStep()}</div>
        </form>
      </div>
    </div>
  );
};

export default VendorBook;
