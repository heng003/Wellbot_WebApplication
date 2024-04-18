import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './updateproperty.css';
import './uploadpropertyphoto.css'; 
import addFileImage from './Images/ADDfile.png';
import Image1 from './Images/Image1.png';
import Image2 from './Images/Image2.png';

const EditPhoto = () => {
    const [photoItems, setPhotoItems] = useState([
      { id: 1, image: Image1 }
    ]);
  
    const handleDelete = (id) => {
      setPhotoItems(photoItems.filter(item => item.id !== id));
    };
  
    return (
      <div className="pageMainContainer">
        <h1 className="pageMainTitle">Upload Your Properties</h1>
        <h2 className="pageMainSubTitle">STEP 2: UPLOAD YOUR PROPERTY'S PHOTO</h2>
        <div className="rectangle">
          {photoItems.map(item => (
            <div key={item.id} className="photoItem">
              <img src={item.image} alt={`Photo ${item.id}`} className="photoImage" />
              <span className="deleteButton" onClick={() => handleDelete(item.id)}>X</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default EditPhoto;