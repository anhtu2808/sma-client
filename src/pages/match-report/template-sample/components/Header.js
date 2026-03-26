import React, { useRef } from 'react';
import EditableField from './EditableField';

const Header = ({ data, onChange, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  return (
    <div className="flex flex-row items-start mb-6">
      <div 
        className="w-[120px] h-[150px] bg-gray-100 mr-8 cursor-pointer relative group flex-shrink-0"
        onClick={handleImageClick}
        title="Click to change avatar"
      >
        <img 
          src={data.avatar || 'https://via.placeholder.com/120x150?text=Avatar'} 
          alt="Avatar" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 hidden group-hover:flex items-center justify-center text-white text-sm">
          Change
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <div className="flex-1 flex flex-col pt-2">
        <EditableField
          html={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          tagName="h1"
          className="text-[28px] font-bold text-[#2551A5] uppercase leading-none pb-1"
        />
        <EditableField
          html={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          tagName="h2"
          className="text-[18px] font-bold text-[#2551A5] mb-3"
        />

        <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 text-[13px] leading-tight text-gray-800">
          <div className="font-bold">Address:</div>
          <EditableField html={data.address} onChange={(e) => onChange('address', e.target.value)} />

          <div className="font-bold">Phone:</div>
          <EditableField html={data.phone} onChange={(e) => onChange('phone', e.target.value)} />

          <div className="font-bold">Email:</div>
          <EditableField html={data.email} onChange={(e) => onChange('email', e.target.value)} />

          <div className="font-bold">Website:</div>
          <EditableField html={data.website} onChange={(e) => onChange('website', e.target.value)} className="underline" />

          <div className="font-bold">GitHub:</div>
          <EditableField html={data.github} onChange={(e) => onChange('github', e.target.value)} className="underline" />
        </div>
      </div>
    </div>
  );
};

export default Header;
