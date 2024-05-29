import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./updateproperty.css";
import "./uploadpropertyphoto.css";
import "./arrangephoto.css";
import addFileImage from "./Images/ADDfile.png";
import Swal from "sweetalert2";

const ArrangePhoto = () => {
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [photoItems, setPhotoItems] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { propertyId } = useParams();

    const getPropertyPhotos = useCallback(async () => {
        try {
            const response = await axios.get(`/api/landlord/properties/uploadPhoto/getPhoto/${propertyId}`);
            const { coverPhoto, photos } = response.data;
            console.log('Response data:', response.data);
            console.log('Cover photo:', coverPhoto);
            console.log('photos:', photos)
            setCoverPhoto(coverPhoto);
            setPhotoItems(photos || []);
        } catch (error) {
            console.error("Error fetching photos:", error);
            setPhotoItems([]);
        }
    }, [propertyId]);

    useEffect(() => {
        getPropertyPhotos(); // to fetch photos when component mounts
    }, [getPropertyPhotos]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/landlord/properties/${propertyId}/deletePhoto/${id}`);
            setPhotoItems(prevItems => prevItems.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    const handleMakeCover = async (id) => {
        try {
            const response = await axios.put(`/api/landlord/properties/makeCoverPhoto/${propertyId}/${id}`);
            console.log('Id photo:', response.data)
            getPropertyPhotos(); 
        } catch (error) {
            console.error("Error making cover photo:", error);
        }
    };


    const handleImageClick = () => {
        fileInputRef.current.click(); 
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            try {
                const formData = new FormData();
                formData.append("photo", file);
                const response = await axios.put(`/api/landlord/properties/uploadPhotoNext/${propertyId}`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  });
                getPropertyPhotos(); 
            } catch (error) {
                console.error("Error uploading photo:", error);
            }
        } else {
            console.log('Please select a valid image file (jpeg or png)');
        }
    };

    const handleUploadButton = (e) => {
        if (location.pathname !== `/landlordArrangePhoto/${propertyId}`) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
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
            }, 500); // Delay to allow scroll to finish
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                Swal.fire({
                    text: "Uploaded successfully!",
                    icon: "success",
                    confirmButtonColor: "#FF8C22",
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/landlordHome");
                    }
                });
            }, 100); // Delay to allow scroll to finish
        }
    }

    return (
        <div className="pageMainContainer">
            <h1 className="pageMainTitle">Upload Your Properties</h1>
            <h2 className="pageMainSubTitle">STEP 2: UPLOAD YOUR PROPERTY'S PHOTO</h2>
            <div>
            {coverPhoto && (
                    <div className="frame">
                        <img className="photo" src={`./component/ImagesUpload/${coverPhoto.image}`} alt="Cover Photo" />
                        <div className="overlay">
                            <div className="text">Cover photo</div>
                            <div className="icon" onClick={() => handleDelete(coverPhoto._id)}>x</div>
                        </div>
                    </div>
                )}
            {photoItems.length > 0 ? (
                    photoItems.map((photo, index) => (
                        <div key={photo._id} className="frame">
                            <img className="photo" src={`./component/ImagesUpload/${photo.image}`} alt="Property" />
                            <div className="overlay">
                                <div className="text2" onClick={() => handleMakeCover(photo._id)}>Make cover photo</div>
                                <div className="icon" onClick={() => handleDelete(photo._id)}>x</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p></p>
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

export default ArrangePhoto;
