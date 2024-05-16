import React, { useState, useEffect, useRef } from 'react';
import { getProperties } from '../services/api';

const PropertySelector = ({ selectedProperty, setSelectedProperty }) => {
  const [properties, setProperties] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesData = await getProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="property-selector" ref={dropdownRef}>
      <label htmlFor="property-select">Your Property</label>
      <div
        className="custom-select"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
      >
        <div className="displayed-value">
          {selectedProperty || "Please Select Your Property"}
        </div>
        {isOpen && (
          <div className="custom-options">
            {properties.map((property, index) => (
              <div
                key={index}
                className={`custom-option ${
                  selectedProperty === property.name ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedProperty(property.name);
                  setIsOpen(false);
                }}
              >
                {property.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertySelector;
