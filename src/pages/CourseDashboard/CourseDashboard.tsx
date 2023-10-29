import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import CoursePlan from '../../components/CoursePlan/CoursePlan';
import VideoDisplay from '../../components/videoDisplay/VideoDisplay';

interface Lesson {
  title: string;
  topics: string[];
  resources: string[];
  searchKeywords: string[];
}

interface Week {
  title: string;
  lessons: Lesson[];
}

interface Course {
  weeks: Week[];
}

const CourseDashboard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const curriculum = useQuery('getCurriculum');

  const parseCurriculum = (textData: string): Course => {
    const weeks: Week[] = [];
    const lines = textData.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentWeek: Week | null = null;
    let currentLesson: Lesson | null = null;
  
    lines.forEach(line => {
      if (line.startsWith('Week')) {
        if (currentWeek) {
          weeks.push(currentWeek);
        }
        currentWeek = { title: line, lessons: [] };
      } else if (line.startsWith('* Lesson')) {
        if (currentWeek) {
          currentLesson = { title: line.slice(2).trim(), topics: [], resources: [], searchKeywords: [] };
          currentWeek.lessons.push(currentLesson);
        }
      } else if (line.startsWith('+ Topics:')) {
        currentLesson?.topics.push(line.slice(9).trim());
      } else if (line.startsWith('+ Resources:')) {
        currentLesson?.resources.push(line.slice(12).trim());
      } else if (line.startsWith('+ Search keywords:')) {
        currentLesson?.searchKeywords.push(line.slice(18).trim());
      }
    });
  
    if (currentWeek) {
      weeks.push(currentWeek);
    }
  
    return { weeks };
  };
  

  const course = curriculum ? parseCurriculum(curriculum) : null;

  return (
    <div className="course-dashboard">
      <div className="course-plan">
        {course && <CoursePlan weeks={course.weeks} onSelectLesson={setSelectedLesson as any} />}
      </div>
      <div className="video-display">
        {selectedLesson && <VideoDisplay keywords={selectedLesson.searchKeywords} />}
      </div>
    </div>
  );
};

export default CourseDashboard;
