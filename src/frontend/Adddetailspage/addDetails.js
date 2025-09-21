import React from 'react';
import {useNavigate } from 'react-router-dom';
import { useState } from 'react';
import menItems from './menitemsdata';
import './addDetails.css'
const DetailsPage = () => {
  const [showMenItems, setShowMenItems] = useState(false);
  const navigate=useNavigate()
  return (
    <div className='bothcontainer' style={{ position: 'relative' }}>
    <div className='container'>
      <h2 >Select Category</h2>
      <div className="detailscontainer">
        <div className='box1' ><button onClick={() => setShowMenItems(true)}></button></div>
        <div className='box2'><button onClick={() => {
            setShowMenItems(false);
            // Optionally show women items
          }}></button></div>
      </div>
      </div>
    <div className='optionsoficon' >
        {showMenItems && (
        <div style={{ display: 'flex', justifyContent: 'center',border:"1px solid black", gap: '20px' }}>
          {menItems.map((item, index) => (
      <button key={index} onClick={() => navigate(item.path)}>
        {item.label}
      </button>
    ))}
          
        </div>
      )}
    
    </div>
      </div>
   
  );
};

export default DetailsPage