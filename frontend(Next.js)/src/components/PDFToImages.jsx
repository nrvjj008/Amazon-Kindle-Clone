import { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PDFToImages({ pdfUrl, onDocumentLoad, onPageLoad }) {
    const [numPages, setNumPages] = useState(null);

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        onDocumentLoad(numPages);
    };

    return (
        <Document file={pdfUrl} onLoadSuccess={handleDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
                <div key={index}>
                    <Page pageNumber={index + 1} onLoadSuccess={onPageLoad} />
                </div>
            ))}
        </Document>
    );
}

export default PDFToImages;
