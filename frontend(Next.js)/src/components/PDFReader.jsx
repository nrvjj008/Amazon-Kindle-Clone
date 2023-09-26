import React, { useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { pdfjs, Document, Page as ReactPdfPage } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const BOOK_WIDTH = 500
const BOOK_HEIGHT = 500;

function PDFReader({ pdfUrl }) {
    const [numPages, setNumPages] = useState(null);

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <Document file={pdfUrl} onLoadSuccess={handleDocumentLoadSuccess}>
           <div className="flex justify-center items-center">
            <HTMLFlipBook
                autoSize={true}
                size={"fixed"}
                width={500}
                height={500}
                maxShadowOpacity={0.5}
                className=""
            >
                {/* Dynamically render all pages of the PDF */}
                {Array.from(new Array(numPages || 0)).map((_, index) => (
                    <div key={index} >
                        <ReactPdfPage pageNumber={index + 1} width={BOOK_WIDTH} height={BOOK_HEIGHT} />
                    </div>
                ))}
            </HTMLFlipBook>
           </div>
        </Document>
    );
}

export default PDFReader;
