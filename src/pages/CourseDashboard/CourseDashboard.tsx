import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import CoursePlan from '../../components/CoursePlan/CoursePlan';
import VideoDisplay from '../../components/videoDisplay/VideoDisplay';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'react-router-dom';
import { Id } from '../../../convex/_generated/dataModel';
import './index.css';
import parseCurriculum  from '../../models/ParseCurriculum';
import {Lesson, Topic, Week, Course} from '../../models/ParseCurriculum';





const CourseDashboard: React.FC = () => {
  const {courseid} = useParams();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const curriculum = useQuery(api.myFunctions.getCurriculum);
  const curriculumData = useQuery(api.myFunctions.getCourse, {courseID: courseid as Id<'projects'>});
  console.log("This should be the course: ", curriculumData);
  
  const course = curriculumData ? parseCurriculum(curriculumData) : null;
  

 // const course = curriculum ? parseCurriculum(curriculum.toString()) : null;
  console.log(course)
  return (
    <div className="course-dashboard">
      <h1>Course dashboard :D</h1>
      <div className="course-plan" content=''>
        {course && <CoursePlan weeks={course.weeks} onSelectLesson={setSelectedLesson as any} />}
      </div>
      <div className="video-display">
        {selectedLesson && <VideoDisplay keywords={selectedLesson.searchKeywords} />}
      </div>
    </div>
  );
};

export default CourseDashboard;
