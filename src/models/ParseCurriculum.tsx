export interface Topic {
    title: string;
  }
  
export interface Lesson {
    title: string;
    topics: Topic[];
    resources: string[];
    searchKeywords: string[];
  }

  
export interface Week {
    title: string;
    lessons: Lesson[];
    hours: number;
    notes?: string;
  }
  
export interface Course {
    title: string;
    weeks: Week[];
    additionalInstructions?: string;
  }

  export const parseTitle = (curriculumData: any): string | null => {
    try {
      const jsonPart = curriculumData.description.match(/{[\s\S]*}/);
      if (!jsonPart) return null;
  
      const courseData = JSON.parse(jsonPart[0]);
      return courseData.title || "null";
    } catch (error) {
      console.error("Error parsing curriculum title:", error);
      return null;
    }
  };
  

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
            topics: lesson.topics.map((topic: string) => ({ title: topic })),
            resources: lesson.resources,
            searchKeywords: lesson.search_keywords,
          })),
          hours: week.hours,
          notes: week.notes,
        })),
        additionalInstructions: courseData.additional_instructions,
      };
  
      return course;
    } catch (error) {
      console.error("Error parsing curriculum data:", error);
      return null;
    }
  };

  export default parseCurriculum;