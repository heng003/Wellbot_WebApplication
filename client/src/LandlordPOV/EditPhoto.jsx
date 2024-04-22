import React, { useState } from 'react';
import { useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './updateproperty.css';
import './uploadpropertyphoto.css'; 
import './editphoto.css'; 
import addFileImage from './Images/ADDfile.png';
import Image1 from './Images/Image1.png';
import Image2 from './Images/Image2.png';
import Swal from 'sweetalert2';

const EditPhoto = () => {
    const [photoItems, setPhotoItems] = useState([
      { id: 1, image: Image1 },
      { id: 2, image: Image2 }
    ]);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [isVisible1, setIsVisible1] = useState(true);
    const [isVisible2, setIsVisible2] = useState(true);

    const handleDelete1 = () => {
        setIsVisible1(false);
    };

    const handleDelete2 = () => {
        setIsVisible2(false);
     };
  
    // const handleDelete = (id) => {
    //   setPhotoItems(photoItems.filter(item => item.id !== id));
    // };

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

      const handleUploadButton = () => {
        if (location.pathname !== "/landlordEditPhoto") {
            Swal.fire({
                title: 'Warning!',
                text: "You need to upload at least 1 property's photo.",
                icon: 'warning',
                confirmButtonColor: "#FF8C22",
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            return;
        } else {
          Swal.fire({
              text: "Uploaded succesfully!",
              icon: "success",
              confirmButtonColor: "#FF8C22",
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate("/landlordHome");
              }
          });
        }
    }
  
    return (
        
      <div className="pageMainContainer">
        <h1 className="pageMainTitle">Edit your property's photo</h1>

        <div>
      {isVisible1 && (
        <div className="frame">
          <img className="photo" src={Image1} alt="Cover" />
          <div className="overlay">
            <div className="text">Cover photo</div>
            <div className="icon" onClick={handleDelete1}>x</div>
          </div>
        </div>
      )}
      {isVisible2 && (
        <div className="frame">
          <img className="photo" src={Image2} alt="Cover" />
          <div className="overlay">
            <div className="text2">Make cover photo</div>
            <div className="icon" onClick={handleDelete2}>x</div>
          </div>
        </div>
      )}
      <div className="rectangleArrangePhoto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg, image/png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <img src={addFileImage} alt="Add File" className="imageAddPhoto" onClick={handleImageClick} />
        <span><p>Add more photos</p></span>
      </div>
    </div>
    <div className="applyButton"> 
                    <button className="applyNowButton" type="button" onClick={handleUploadButton}>Upload</button>
                </div>
      </div>
    );
  };

export default EditPhoto;