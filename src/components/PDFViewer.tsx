import React from "react";
import { Document, Page } from "react-pdf";

// Configure the worker
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


interface PDFViewerProps {
    base64String: string;
}

const CustomPDFViewer: React.FC<PDFViewerProps> = ({ base64String }) => {
    // Decode Base64 to Uint8Array
    const pdfData = Uint8Array.from(
        atob(base64String),
        (char) => char.charCodeAt(0)
    );

    return (
        <div>
            <Document file={`data:application/pdf;base64,` + base64String}>
                <Page width={550} height={300} pageNumber={1}/>
            </Document>
        </div>
    );
};

export default CustomPDFViewer;
