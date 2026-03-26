import React from 'react';
import SectionHeader from './SectionHeader';
import EditableField from './EditableField';
import { Plus, Trash2 } from 'lucide-react';

const Skills = ({ data, onChange }) => {
  const handleItemChange = (index, field, value) => {
    const newData = [...data.items];
    newData[index][field] = value;
    onChange('items', newData);
  };

  const addItem = () => {
    onChange('items', [...data.items, { category: 'New Category', skills: 'Skill 1, Skill 2' }]);
  };

  const removeItem = (index) => {
    onChange('items', data.items.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6 relative group/section">
      <SectionHeader 
        title={data.title || "SKILLS"} 
        onChange={(e) => onChange('title', e.target.value)} 
      />
      
      <ul className="list-disc pl-5 text-[13px] leading-relaxed text-gray-800 space-y-1">
        {data.items.map((item, index) => (
          <li key={index} className="relative group/item ml-1">
            <span className="font-bold">
              <EditableField
                html={item.category}
                onChange={(e) => handleItemChange(index, 'category', e.target.value)}
              />: 
            </span>{' '}
            <EditableField
              html={item.skills}
              onChange={(e) => handleItemChange(index, 'skills', e.target.value)}
            />
            
            <button 
              onClick={() => removeItem(index)}
              className="absolute -left-[30px] top-1 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
              title="Remove skill"
            >
              <Trash2 size={13} />
            </button>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={addItem}
        className="mt-2 flex items-center text-xs text-blue-600 opacity-0 group-hover/section:opacity-100 transition-opacity font-medium absolute -bottom-5 left-0"
      >
        <Plus size={14} className="mr-1" /> Add Skill
      </button>
    </div>
  );
};

export default Skills;
