import React, { useState } from "react";
import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./updateproperty.css";
import "./uploadpropertyphoto.css";
import "./arrangephoto.css";
import addFileImage from "./Images/ADDfile.png";
import Image1 from "./Images/Image1.png";
import Image2 from "./Images/Image2.png";
import Swal from "sweetalert2";

const ArrangePhoto = () => {
    const [photoItems, setPhotoItems] = useState([
        { id: 1, image: Image1, isCover: true },
        { id: 2, image: Image2, isCover: false }
    ]);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDelete = (id) => {
        setPhotoItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleMakeCover = (id) => {
        setPhotoItems(prevItems => {
            const newItems = [...prevItems];
            const index1 = newItems.findIndex(item => item.id === 1);
            const index2 = newItems.findIndex(item => item.id === 2);
            if (index1 !== -1 && index2 !== -1) {
                // Swap the positions of the images
                const temp = newItems[index1].image;
                newItems[index1].image = newItems[index2].image;
                newItems[index2].image = temp;
            }
            return newItems;
        });
    };

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
        if (location.pathname !== "/landlordArrangePhoto") {
            Swal.fire({
                title: 'Warning!',
                text: 'You need to register or log in to your account before performing this action.',
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
                text: "Uploaded successfully!",
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
    };

    return (
        <div className="pageMainContainer">
            <h1 className="pageMainTitle">Upload Your Properties</h1>
            <h2 className="pageMainSubTitle">STEP 2: UPLOAD YOUR PROPERTY'S PHOTO</h2>
            <div>
                {photoItems.map(({ id, image, isCover }) => (
                    <div key={id} className="frame">
                        <img className="photo" src={image} alt="Property" />
                        <div className="overlay">
                            {isCover ? (
                                <div className="text">Cover photo</div>
                            ) : (
                                <div className="text2" onClick={() => handleMakeCover(id)}>Make cover photo</div>
                            )}
                            <div className="icon" onClick={() => handleDelete(id)}>x</div>
                        </div>
                    </div>
                ))}
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

export default ArrangePhoto;
