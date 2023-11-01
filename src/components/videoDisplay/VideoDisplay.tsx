import React, { useState, useEffect } from 'react';
import './../../pages/CourseDashboard/index.css';

const VideoDisplay = ({ keywords }) => {
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const searchQuery = encodeURIComponent(keywords.join(', '));
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=AIzaSyDiIynJqBlpeVWFBbf-uV2IhDZ2l7O7LnQ`);
      const data = await response.json();
      const videoId = data.items[0]?.id.videoId;
      setVideoId(videoId);
    };

    if (keywords.length > 0) {
      fetchVideo();
    }
  }, [keywords]);

  return videoId ? (
    <iframe
      title="Lesson Video"
      src={`https://www.youtube.com/embed/${videoId}`}
      width="100%"
      height="100%" // You can set this to whatever height you desire

      allowFullScreen
    />
  ) : (
    <p>Loading video...</p>
  );
};

export default VideoDisplay;
