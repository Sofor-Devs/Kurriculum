import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import './index.css';
import { api } from '../../../convex/_generated/api';


const CurriculumPage = () => {
  const navigate = useNavigate();
  const curriculum = useQuery(api.myFunctions.getCurriculum); // Fetch curriculum data from Convex

  console.log(curriculum);
  const goToCourseDashboard = (courseId: number) => {
    navigate(`/course-dashboard/${courseId}`);
  };

  if (!curriculum) {
    return <div>Loading...</div>;
  }

return (
  <div className="curriculum-container">
    {curriculum && curriculum.map((course) => (
      <div
        key={course._id || course.id} // Fall back to 'id' if '_id' is not available
        className="course-card"
        onClick={() => goToCourseDashboard(course._id || course.id)}
      >
        {course.projectName || 'Unnamed Course'} {/* Provide a default name if projectName is not available */}
      </div>
    ))}
  </div>
);
    };
export default CurriculumPage;
