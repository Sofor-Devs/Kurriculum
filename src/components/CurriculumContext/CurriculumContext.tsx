import React, { ReactNode, createContext, useContext } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const CurriculumContext = createContext(null);
interface CurriculumContextProps {
    curriculumDetails: CurriculumDetails | null;
    setCurriculumDetails: (curriculumDetails: CurriculumDetails) => void;
  }
  
  interface CurriculumProviderProps {
    children: ReactNode;
  }

export const CurriculumProvider = ({ children }) => {
  const curriculumData = useQuery(api.myFunctions.getCurriculum);

  return (
    <CurriculumContext.Provider value={curriculumData}>
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
};

interface CurriculumDetails {
  timeline: string;
  projectSummary: string;
  experienceLevel: string;
  numClassesPerWeek: string;
  classDays: string[];
  curriculum: string;
  keywords: string[];
}





