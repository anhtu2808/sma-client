import React from 'react';
import SectionHeader from './SectionHeader';
import EditableField from './EditableField';
import { Plus, Trash2 } from 'lucide-react';

const Education = ({ data, onChange }) => {
  const handleItemChange = (index, field, value) => {
    const newData = [...data.items];
    newData[index][field] = value;
    onChange('items', newData);
  };

  const addItem = () => {
    onChange('items', [...data.items, { institution: 'New Institution', duration: 'Date - Date', major: 'Major', gpa: '0.0' }]);
  };

  const removeItem = (index) => {
    onChange('items', data.items.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6 relative group/section">
      <SectionHeader 
        title={data.title || "EDUCATION"} 
        onChange={(e) => onChange('title', e.target.value)} 
      />
      
      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div key={index} className="relative group/item">
            <div className="flex justify-between items-baseline mb-0.5">
              <EditableField 
                html={item.institution} 
                onChange={(e) => handleItemChange(index, 'institution', e.target.value)}
                className="font-bold text-[14px] text-gray-900" 
              />
              <EditableField 
                html={item.duration} 
                onChange={(e) => handleItemChange(index, 'duration', e.target.value)}
                className="font-bold text-[13px] text-gray-900" 
              />
            </div>
            <ul className="list-disc pl-6 text-[13px] text-[#333] space-y-0.5">
              <li>
                <EditableField 
                  html={item.major} 
                  onChange={(e) => handleItemChange(index, 'major', e.target.value)}
                />
              </li>
              <li>
                GPA: <EditableField 
                  html={item.gpa} 
                  onChange={(e) => handleItemChange(index, 'gpa', e.target.value)}
                />
              </li>
            </ul>

            <button 
              onClick={() => removeItem(index)}
              className="absolute -left-[20px] top-1 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
              title="Remove education"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addItem}
        className="mt-2 flex items-center text-xs text-blue-600 opacity-0 group-hover/section:opacity-100 transition-opacity font-medium absolute -bottom-5 left-0"
      >
        <Plus size={14} className="mr-1" /> Add Education
      </button>
    </div>
  );
};

export default Education;
