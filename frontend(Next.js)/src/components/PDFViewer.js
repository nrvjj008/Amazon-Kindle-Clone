// components/PDFViewer.js
import React, { useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import pdfjs from 'pdfjs-dist/esm/build/pdf';
import pdfWorker from 'pdfjs-dist/esm/build/pdf.worker.entry';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFViewer = ({ file }) => {
    return (
        <Document
            file={file}
            onLoadSuccess={console.log}
            onLoadError={console.error}
        >
            <Page pageNumber={1} />
        </Document>
    );
};

export default PDFViewer;
