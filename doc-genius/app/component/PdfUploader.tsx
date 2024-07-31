// app/components/PdfUploader.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${process.env.PDFJS_VERSION}/build/pdf.worker.min.js`;

const PdfUploader: React.FC = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);

      try {
        const loadingTask = getDocument({ data: typedArray });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let text = '';

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          text += pageText + '\n';
        }

        setPdfText(text);
      } catch (error) {
        console.error('Error reading PDF:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleAskQuestion = async () => {
    if (!question) return;

    try {
      const response = await axios.post('/api/qa', { question, pdfText });
      setResponse(response.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      <textarea
        rows={10}
        cols={80}
        readOnly
        value={pdfText}
        placeholder="PDF content will appear here..."
      />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question about the PDF"
        className="text-black"
      />
      <button onClick={handleAskQuestion}>Ask</button>
      {response && <div><strong>Response:</strong> {response}</div>}
    </div>
  );
};

export default PdfUploader;
