import React from 'react';
import './../../pages/CourseDashboard/index.css';

const VideoDisplay = ({ keywords }) => {
  const generateVideoSrc = (keywords) => {
    // Replace with your actual video generation logic
    // Here is an example of generating a YouTube search URL
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(keywords.join(', '))}`;
  };

  return (
    <iframe
      title="Lesson Video"
      src={generateVideoSrc(keywords)}
      width="100%"
      height="100%"
    />
  );
};

export default VideoDisplay;
