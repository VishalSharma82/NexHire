import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker source for pdfjs using Vite-native worker import
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const parsePDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n';
  }
  
  return fullText;
};

export const parseDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const extractTextFromFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'pdf') {
    return await parsePDF(file);
  } else if (extension === 'docx') {
    return await parseDOCX(file);
  } else if (extension === 'txt' || extension === 'md') {
    return await file.text();
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  }
};
