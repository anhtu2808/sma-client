import React from 'react';
import SectionHeader from './SectionHeader';
import EditableField from './EditableField';

const Summary = ({ data, onChange }) => {
  return (
    <div className="mb-6">
      <SectionHeader 
        title={data.title || "SUMMARY"} 
        onChange={(e) => onChange('title', e.target.value)} 
      />
      <EditableField
        html={data.content}
        onChange={(e) => onChange('content', e.target.value)}
        tagName="div"
        className="text-[13px] leading-relaxed text-gray-800 text-justify"
      />
    </div>
  );
};

export default Summary;
