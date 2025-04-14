import React, { useState } from 'react';
import OneDrivePicker from './oneDrivePicker';

const OneDriveExample = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
    console.log('Selected files:', files);
  };

  return (
    <div className="container mt-5">
      <h2>OneDrive Document Selection</h2>
      
      <div className="my-4">
        <OneDrivePicker 
          onFilesSelected={handleFilesSelected}
          allowMultiple={true}
          fileTypes={['.doc', '.docx', '.pdf', '.xls', '.xlsx']}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3>Selected Files:</h3>
          <div className="list-group">
            {selectedFiles.map((file, index) => (
              <div key={index} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{file.name}</h5>
                    <small className="text-muted">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB | 
                      Type: {file.type} |
                      Last Modified: {new Date(file.lastModified).toLocaleDateString()}
                    </small>
                  </div>
                  {file.downloadUrl && (
                    <a 
                      href={file.downloadUrl} 
                      className="btn btn-sm btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OneDriveExample; 