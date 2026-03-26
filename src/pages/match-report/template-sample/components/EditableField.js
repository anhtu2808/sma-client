import React from 'react';
import ContentEditable from 'react-contenteditable';

const EditableField = ({ html, onChange, tagName = 'span', className = '', ...props }) => {
  return (
    <ContentEditable
      html={html || ''}
      disabled={false}
      onChange={onChange}
      tagName={tagName}
      className={`outline-none hover:bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-200 transition-colors ${className}`}
      {...props}
    />
  );
};

export default EditableField;
