import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const CurriculumPage = () => {
  const curriculum = useQuery(api.myFunctions.getCurriculum);

  if (!curriculum) {
    return <div>Loading...</div>;
  }

  return (
    <div className="curriculum-page">
      {curriculum.map((session, index) => (
        <div key={index} className="session-details">
          <Link to={`/dashboard/${index}`}>
            <h3 className="session-title">{session.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CurriculumPage;
