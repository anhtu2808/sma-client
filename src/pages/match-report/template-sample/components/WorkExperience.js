import React from 'react';
import SectionHeader from './SectionHeader';
import EditableField from './EditableField';
import { Plus, Trash2 } from 'lucide-react';

const WorkExperience = ({ data, onChange }) => {
  const handleItemChange = (index, field, value) => {
    const newData = [...data.items];
    newData[index][field] = value;
    onChange('items', newData);
  };

  const handleBulletChange = (itemIndex, bIdx, field, value) => {
    const newData = [...data.items];
    newData[itemIndex].bullets[bIdx][field] = value;
    onChange('items', newData);
  };

  const addBullet = (itemIndex) => {
    const newData = [...data.items];
    newData[itemIndex].bullets.push({ label: 'New Label', value: 'New detail' });
    onChange('items', newData);
  };

  const removeBullet = (itemIndex, bIdx) => {
    const newData = [...data.items];
    newData[itemIndex].bullets = newData[itemIndex].bullets.filter((_, i) => i !== bIdx);
    onChange('items', newData);
  };

  const addItem = () => {
    onChange('items', [
      ...data.items, 
      { 
        company: 'New Company', 
        role: 'Role', 
        duration: 'Date - Date', 
        description: 'New description.', 
        bullets: [{ label: 'Detail', value: 'Some detail' }] 
      }
    ]);
  };

  const removeItem = (index) => {
    onChange('items', data.items.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6 relative group/section">
      <SectionHeader 
        title={data.title || "WORK EXPERIENCE"} 
        onChange={(e) => onChange('title', e.target.value)} 
      />
      
      <div className="space-y-6">
        {data.items.map((item, index) => (
          <div key={index} className="relative group/item">
            <div className="flex justify-between items-baseline mb-1">
              <div className="font-bold text-[14px] text-gray-900">
                <EditableField 
                  html={item.company} 
                  onChange={(e) => handleItemChange(index, 'company', e.target.value)}
                /> - <span className="font-normal"><EditableField 
                  html={item.role} 
                  onChange={(e) => handleItemChange(index, 'role', e.target.value)}
                /></span>
              </div>
              <EditableField 
                html={item.duration} 
                onChange={(e) => handleItemChange(index, 'duration', e.target.value)}
                className="font-bold text-[13px] text-gray-900" 
              />
            </div>
            
            <EditableField 
              html={item.description} 
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="text-[13px] text-gray-800 text-justify mb-2 leading-relaxed"
              tagName="div"
            />

            <ul className="list-disc pl-6 text-[13px] text-[#333] space-y-1">
              {item.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="relative group/bullet ml-1">
                  {bullet.label && (
                    <span className="font-bold">
                      <EditableField 
                        html={bullet.label} 
                        onChange={(e) => handleBulletChange(index, bIdx, 'label', e.target.value)}
                      />: 
                    </span>
                  )}{' '}
                  <EditableField 
                    html={bullet.value} 
                    onChange={(e) => handleBulletChange(index, bIdx, 'value', e.target.value)}
                    className={bullet.isLink ? "underline" : ""}
                  />
                  
                  <button 
                    onClick={() => removeBullet(index, bIdx)}
                    className="absolute -left-[30px] top-1 text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                    title="Remove bullet"
                  >
                    <Trash2 size={12} />
                  </button>
                </li>
              ))}
              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity -ml-4">
                <button 
                  onClick={() => addBullet(index)}
                  className="mt-1 flex items-center text-[11px] text-blue-500 font-medium"
                >
                  <Plus size={12} className="mr-1" /> Add Detail
                </button>
              </div>
            </ul>

            <button 
              onClick={() => removeItem(index)}
              className="absolute -left-[20px] top-1 text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
              title="Remove job"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={addItem}
        className="mt-4 flex items-center text-xs text-blue-600 opacity-0 group-hover/section:opacity-100 transition-opacity font-medium absolute -bottom-5 left-0"
      >
        <Plus size={14} className="mr-1" /> Add Work Experience
      </button>
    </div>
  );
};

export default WorkExperience;
