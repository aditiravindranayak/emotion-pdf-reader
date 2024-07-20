import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const PdfUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    onFileUpload(uploadedFile);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {file && (
        <div>
          <Document file={file}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
