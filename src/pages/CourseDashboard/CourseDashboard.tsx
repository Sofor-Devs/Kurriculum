import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const CourseDashboard = () => {
  const { id } = useParams();
  const curriculum = useQuery(api.myFunctions.getCurriculum);

  if (!curriculum || !id) {
    return <div>Loading...</div>;
  }

  const courseDetails = curriculum[parseInt(id)];

  return (
    <div className="course-dashboard">
      <h2>{courseDetails.title}</h2>
      <p>{courseDetails.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default CourseDashboard;
