import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dropdown({ title, items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {title} <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div 
          className="dropdown-menu"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {items.map((item, index) => (
            <Link to={item.path} key={index} className="dropdown-item" onClick={() => setIsOpen(false)}>
              {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
              <div className="dropdown-item-text">
                <strong>{item.title}</strong>
                {item.subtitle && <small>{item.subtitle}</small>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;