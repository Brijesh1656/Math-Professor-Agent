import React, { useRef } from 'react';
import { UploadIcon } from '../constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
      // Reset the input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".txt,.pdf"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="relative p-4 rounded-2xl text-gray-400 hover:text-blue-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 glass group"
        aria-label="Upload a text or PDF file"
      >
        <UploadIcon className="w-6 h-6 transform group-hover:-translate-y-0.5 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity"></span>
      </button>
    </>
  );
};

export default FileUpload;