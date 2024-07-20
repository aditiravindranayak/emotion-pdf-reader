import React, { useState, useRef } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import compromise from 'compromise';
import '../Pages/home.css'; // Importing CSS for styling

// Set the workerSrc to point to the worker script
GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [persons, setPersons] = useState([]);
  const [places, setPlaces] = useState([]);
  const [emotionalWords, setEmotionalWords] = useState([]);
  const [pronouns, setPronouns] = useState([]); // State for pronouns
  const [isReading, setIsReading] = useState(false);
  const [pdfText, setPdfText] = useState(''); // State for the entire PDF text
  const speechSynthesisRef = useRef(null);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      extractInfoFromPdf(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Function to extract text from PDF
  const extractInfoFromPdf = (pdfFile) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await getDocument({ data: typedArray }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += `${pageText} `;
      }
      setPdfText(text); // Save the extracted text
      processText(text);
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  // Function to process extracted text
  const processText = (text) => {
    const doc = compromise(text);
    const persons = doc.people().out('array');
    const places = doc.places().out('array');
    const emotionalWords = doc.sentences().out('array').filter(sent =>
      sent.includes('happy') || sent.includes('sad') || sent.includes('angry')
    );
    const pronouns = doc.match('(he|she)').out('array'); // Extract pronouns

    setPersons(persons);
    setPlaces(places);
    setEmotionalWords(emotionalWords);
    setPronouns(pronouns);
  };

  // Function to start emotion-based PDF reading
  const startEmotionBasedReading = () => {
    if (isReading) {
      speechSynthesisRef.current.cancel();
    }

    const utterances = [];
    const doc = compromise(pdfText); // Process the entire PDF text

    doc.sentences().forEach(sent => {
      const utterance = new SpeechSynthesisUtterance(sent.text());
      if (sent.text().includes('happy')) {
        utterance.pitch = 1.5;
      } else if (sent.text().includes('sad')) {
        utterance.pitch = 0.5;
      } else if (sent.text().includes('angry')) {
        utterance.pitch = 0.75;
      } else {
        utterance.pitch = 1;
      }

      utterance.onend = () => {
        if (utterances.length) {
          window.speechSynthesis.speak(utterances.shift());
        } else {
          setIsReading(false);
        }
      };

      utterances.push(utterance);
    });

    if (utterances.length) {
      speechSynthesisRef.current = utterances[0];
      window.speechSynthesis.speak(utterances.shift());
      setIsReading(true);
    }
  };

  // Function to start reading from the beginning
  const startReadingFromBeginning = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
    startEmotionBasedReading();
  };

  // Function to stop reading
  const stopReading = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  // Function to continue reading
  const continueReading = () => {
    if (!isReading) {
      startEmotionBasedReading();
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="title-box">
          <h1 className="title">Emotion PDF Reader</h1>
        </div>
        <p className="subtitle">Upload a PDF and Explore its content with Emotion detection.</p>
      </header>
      <section className="upload-section">
        <div className="file-upload">
          <input
            type="file"
            accept=".pdf"
            id="upload-pdf"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-pdf" className="upload-button">Choose PDF File</label>
        </div>
        <p className="upload-instructions">Supported file types: PDF</p>
      </section>
      {pdfFile && (
        <section className="info-section">
          <h2 className="section-title">Extracted Information</h2>
          <div className="info-lists">
            <div className="info-list">
              <h3 className="info-title">Persons and Pronouns</h3>
              <ul className="info-items">
                {persons.map((person, index) => (
                  <li key={index} className="info-item">
                    {person} {pronouns[index] && `(${pronouns[index]})`}
                  </li>
                ))}
              </ul>
            </div>
            <div className="info-list">
              <h3 className="info-title">Places</h3>
              <ul className="info-items">
                {places.map((place, index) => (
                  <li key={index} className="info-item">{place}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="emotional-words-section">
            <h3 className="info-title">Emotional Words</h3>
            <ul className="info-items">
              {emotionalWords.map((word, index) => (
                <li key={index} className="info-item">{word}</li>
              ))}
            </ul>
          </div>
          <button className="start-reading-btn" onClick={startEmotionBasedReading} disabled={isReading}>
            Start Emotion-Based Reading
          </button>
          <div className="reading-controls">
            <button onClick={startReadingFromBeginning} disabled={isReading}>
              Start Reading from Beginning
            </button>
            <button onClick={stopReading} disabled={!isReading}>
              Stop Reading
            </button>
            <button onClick={continueReading} disabled={isReading}>
              Continue Reading
            </button>
          </div>
        </section>
      )}
      <footer className="footer">
        <p className="footer-text">Developed by techateam &copy; 2024</p>
      </footer>
    </div>
  );
};

export default Home;
