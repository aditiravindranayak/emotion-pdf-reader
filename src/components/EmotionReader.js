import React from 'react';

const EmotionReader = ({ text, emotions }) => {
  const synth = window.speechSynthesis;

  const speakText = (text) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'en-US';

    if (emotions.includes('happy')) {
      utterThis.pitch = 1.5;
      utterThis.rate = 1.2;
    } else if (emotions.includes('sad')) {
      utterThis.pitch = 0.5;
      utterThis.rate = 0.8;
    } else if (emotions.includes('angry')) {
      utterThis.pitch = 1;
      utterThis.rate = 1;
      utterThis.volume = 1.2;
    } else if (emotions.includes('excited')) {
      utterThis.pitch = 1.7;
      utterThis.rate = 1.5;
    } else if (emotions.includes('fearful')) {
      utterThis.pitch = 0.8;
      utterThis.rate = 0.9;
    }

    synth.speak(utterThis);
  };

  return (
    <div>
      <button onClick={() => speakText(text)}>Read with Emotions</button>
    </div>
  );
};

export default EmotionReader;
