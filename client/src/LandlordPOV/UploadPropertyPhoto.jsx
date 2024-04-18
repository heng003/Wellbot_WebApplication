import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import './updateproperty.css';
import './uploadpropertyphoto.css'; 
import addFileImage from './Images/ADDfile.png';

const UploadPropertyPhoto = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleFileChange = (e) => {
    // Handle file change logic here
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        navigate('/landlordArrangePhoto');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('Selected file:', file);
    } else {
      console.log('Please select a valid image file (jpeg or png)');
    }
  };

return (
    

    <div className="pageMainContainer">

        <h1 className="pageMainTitle">Upload Your Properties</h1>

        <h2 className="pageMainSubTitle">STEP 2 : UPLOAD YOUR PROPERTY'S PHOTO </h2>

        <div className="container">
      <div className="rectangle">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <img src={addFileImage} alt="Add File" className="image" onClick={handleImageClick} />
        <p className="boldText">Upload Photo</p>
        <p className="greyText">Upload from your device</p>
      </div>
    </div>
    <div className="additionalInfo">
        <p>Important:</p>
        <ul>
          1. At least 3 photos required.</ul>
          <ul>
          2. High-quality photos.</ul>
          <ul>
          3. Allowed file types: JPEG, TIF, PNG.</ul>
          <ul>
          4. Photos must be less than 5MB.</ul>
          <ul>
          5. Do not include any personal details in the photo.
        </ul>
      </div>
    </div>
    );
};

export default UploadPropertyPhoto;