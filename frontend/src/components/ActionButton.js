// src/components/ActionButton.jsx
import React from 'react';

function ActionButton({ icon: Icon, label, onClick, color = '#dfe6e9' }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '8px 10px',
        borderRadius: '6px',
        border: 'none',
        fontSize: '0.85rem',
        cursor: 'pointer',
        backgroundColor: color,
        color: '#2d3436'
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

export default ActionButton;
