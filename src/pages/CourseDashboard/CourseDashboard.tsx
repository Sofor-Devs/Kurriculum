import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import CoursePlan from '../../components/CoursePlan/CoursePlan';
import VideoDisplay from '../../components/videoDisplay/VideoDisplay';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'react-router-dom';
import { Id } from '../../../convex/_generated/dataModel';

interface Topic {
  title: string;
  description: string;
}

interface Lesson {
  title: string;
  topics: Topic[];
  resources: string[];
  searchKeywords: string[];
}

interface Week {
  title: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  weeks: Week[];
}

const parseCurriculum = (curriculumData: any): Course | null => {
  try {
    // Find the JSON part in the curriculum data
    const jsonPart = curriculumData.description.match(/{[\s\S]*}/);
    if (!jsonPart) return null;

    // Parse the JSON part to get the course data
    const courseData = JSON.parse(jsonPart[0]);

    // Map the course data to your Course interface
    const course: Course = {
      title: courseData.title,
      weeks: courseData.weeks.map((week: any) => ({
        title: week.title,
        lessons: week.lessons.map((lesson: any) => ({
          title: lesson.title,
          topics: lesson.topics.map((topic: string) => ({
            title: topic?.split(':')[0]?.trim(),
            description: topic?.split(':')[1]?.trim(),
          })),
          resources: lesson.resources,
          searchKeywords: lesson.search_keywords,
        })),
      })),
    };

    return course;
  } catch (error) {
    console.error("Error parsing curriculum data:", error);
    return null;
  }
};

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
