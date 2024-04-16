import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';
import './landlord_history.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import downloadIcon from './Rental_Icon/download.png';
import CommentIcon from './Rental_Icon/comment.png';
import DownloadHoverIcon from './Rental_Icon/download_hover.png';
import CommentHoverIcon from './Rental_Icon/comment_hover.png';
import Alert from "../LandlordPOV/Alert";

function LandlordHistory() {

    const [hoveredDownloadIcon, setHoveredDownloadIcon] = useState({});
    const [hoveredCommentIcon, setHoveredCommentIcon] = useState({});
    const [hoveredDownloadIcon2, setHoveredDownloadIcon2] = useState({});
    const [hoveredCommentIcon2, setHoveredCommentIcon2] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('Please Select Your Property');
    const dropdownRef = useRef(null);

    const properties = [
        "Tiara Damandasara’s Master Room (Unit 315/3)",
        "Ryan and Miho Condomium (Unit 215/2)",
        "Sekyen 17, Landed House",
        "8 Trium Office Room, Unit 15"
      ];
    
    const tenants = [
        { id: 'Lye23356', date: '7 January 2024 - 7 January 2025', status: 'Effective' },
        { id: 'Sioskso45', date: '6 December 2022 - 6 December 2023', status: 'Expired' },
        { id: 'MuhammadAli', date: '31 December 2020 - 2 December 2021', status: 'Expired' },
      ];
    
    const tenants2 = [
        { id: 'Idharib78', date: '7 December 2024 - 7 December s2025', status: 'Effective' }
      ];

    const handleDownloadIconMouseEnter = index => setHoveredDownloadIcon(prev => ({ ...prev, [index]: true }));
    const handleDownloadIconMouseLeave = index => setHoveredDownloadIcon(prev => ({ ...prev, [index]: false }));
    const handleCommentIconMouseEnter = index => setHoveredCommentIcon(prev => ({ ...prev, [index]: true }));
    const handleCommentIconMouseLeave = index => setHoveredCommentIcon(prev => ({ ...prev, [index]: false }));

    const handleDownloadIconMouseEnter2 = index => setHoveredDownloadIcon2(prev => ({ ...prev, [index]: true }));
    const handleDownloadIconMouseLeave2 = index => setHoveredDownloadIcon2(prev => ({ ...prev, [index]: false }));
    const handleCommentIconMouseEnter2 = index => setHoveredCommentIcon2(prev => ({ ...prev, [index]: true }));
    const handleCommentIconMouseLeave2 = index => setHoveredCommentIcon2(prev => ({ ...prev, [index]: false }));

    const handlePropertyChange = event => setSelectedProperty(event.target.value);

    const handleAlert = () => {
        Alert();
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
             return () => document.removeEventListener('mousedown', handleClickOutside);
    },[]);

    const triggerDownload = () => {
        const link = document.createElement('a');
        link.href = 'https://drive.google.com/uc?export=download&id=17cF4WZw6zIB96n7WgmE2tN2_IxhFwvPp';
        link.download = 'LeaseAgreement.pdf';  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        {handleAlert()};
    };

    const renderTable = (data, downloadIconState, commentIconState, handleDownloadEnter, handleDownloadLeave, handleCommentEnter, handleCommentLeave) => (
        <table className="history-table">
            <thead>
                <tr>
                    <th>Tenant's Username</th>
                    <th>Effective Date</th>
                    <th>Lease Agreement Status</th>
                    <th></th>
                </tr>
            </thead>
      
            <tbody>
                {data.map((tenant, index) => (
                <tr key={tenant.id}>
                    <td>{tenant.id}</td>
                    <td>{tenant.date}</td>
                    <td>{tenant.status}</td>
                    <td>
                        <img 
                        src={downloadIconState[index] ? DownloadHoverIcon : downloadIcon}
                        className="downloadIcon"
                        alt="Download Icon"
                        onMouseEnter={() => handleDownloadEnter(index)}
                        onMouseLeave={() => handleDownloadLeave(index)}
                        onClick={triggerDownload}
                        width="29"
                        height="27"
                        />

                        <a 
                        href="/landlordComment" 
                        className="comment_linkIcon"
                        onMouseEnter={() => handleCommentEnter(index)}
                        onMouseLeave={() => handleCommentLeave(index)}
                        >
                
                            <img 
                            src={commentIconState[index] ? CommentHoverIcon : CommentIcon}
                            alt="Comment Link" 
                            width="25.17" 
                            height="27"
                            />

                        </a>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    );


    const renderTablesBasedOnSelection = () => {
        if (!selectedProperty || selectedProperty === 'Please Select Your Property') {
         
          return (
            <>
              <h2 className="propertyName">{properties[0]}</h2>
              {renderTable(tenants, hoveredDownloadIcon, hoveredCommentIcon, handleDownloadIconMouseEnter, handleDownloadIconMouseLeave, handleCommentIconMouseEnter, handleCommentIconMouseLeave)}
              <h2 className="propertyName">{properties[1]}</h2>
              {renderTable(tenants2, hoveredDownloadIcon2, hoveredCommentIcon2, handleDownloadIconMouseEnter2, handleDownloadIconMouseLeave2, handleCommentIconMouseEnter2, handleCommentIconMouseLeave2)}
            </>
          );
        } else {
        
          switch (selectedProperty) {
            case properties[0]:
              return (
                <>
                  <h2 className="propertyName">{properties[0]}</h2>
                  {renderTable(tenants, hoveredDownloadIcon, hoveredCommentIcon, handleDownloadIconMouseEnter, handleDownloadIconMouseLeave, handleCommentIconMouseEnter, handleCommentIconMouseLeave)}
                </>
              );
            case properties[1]:
              return (
                <>
                  <h2 className="propertyName">{properties[1]}</h2>
                  {renderTable(tenants2, hoveredDownloadIcon2, hoveredCommentIcon2, handleDownloadIconMouseEnter2, handleDownloadIconMouseLeave2, handleCommentIconMouseEnter2, handleCommentIconMouseLeave2)}
                </>
              );

              case properties[2]:
              return (
                <>
      
                  <h3 className = "notHistory_Text">Sorry, this property hasn't been rented out yet, so it <b>doesn't have any rental history</b>. You might review its applicants for renting purposes.</h3>
                </>
              );
          
            default:
                return(
                    <>
                  <h2 className="propertyName">{properties[0]}</h2>
                  {renderTable(tenants, hoveredDownloadIcon, hoveredCommentIcon, handleDownloadIconMouseEnter, handleDownloadIconMouseLeave, handleCommentIconMouseEnter, handleCommentIconMouseLeave)}
                  </>
                )
              
          }
        }
      };
      


    return (

    <div className="rental-history">
        <h1 className="rentalTitle">Rental History</h1>
        <div className="property-selector" ref={dropdownRef}>

            <label htmlFor="property-select">Your Property</label>     
            <div className="custom-select" tabIndex={0} onClick={() => setIsOpen(!isOpen)} onBlur={() => setIsOpen(false)}>
                <div className="displayed-value">{selectedProperty || 'Please Select Your Property'}</div>
                    {isOpen && (
                        <div className="custom-options">
                            {properties.map((property, index) => (
                                <div key={index} className={`custom-option ${selectedProperty === property ? 'selected' : ''}`} onClick={() => {
                                    setSelectedProperty(property);
                                    setIsOpen(false);
                                    }}>
                                    {property}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        <div className="property-details">
            {renderTablesBasedOnSelection()}
        </div>

  </div>
);
}

export default LandlordHistory;