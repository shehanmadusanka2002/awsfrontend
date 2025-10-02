import React from 'react';

const FilePreview = ({ fileUrl, newFile, altText, className = "w-24 h-24" }) => {
    if (newFile) {
        return (
            <img 
                src={URL.createObjectURL(newFile)} 
                alt={`New ${altText} Preview`} 
                className={`${className} object-cover rounded-md my-2 border`}
            />
        );
    }
    if (fileUrl) {
        return (
            <img 
                src={fileUrl} 
                alt={altText} 
                className={`${className} object-cover rounded-md my-2 border`}
            />
        );
    }
    return null;
};

export default FilePreview;



