import React from 'react';
import EditableField from './EditableField';

const SectionHeader = ({ title, onChange }) => {
  return (
    <div className="mb-2">
      <EditableField
        html={title}
        onChange={onChange}
        tagName="h2"
        className="text-[#2551A5] font-bold text-lg uppercase tracking-wide mb-1"
      />
      <hr className="border-[#2551A5] border-t-[1.5px]" />
    </div>
  );
};

export default SectionHeader;
