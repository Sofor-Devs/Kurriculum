import React, { useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { APIKeys } from "../components/Keys/keys";

import "./loading.css"; // Create a loading.css file with your loading bar style
import { useNavigate } from "react-router-dom";
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

interface OptionType {
  value: string;
  label: string;
}
interface Curriculum {
  [week: string]: {
    title: string;
    lessons: Lesson[];
  };
}

interface Lesson {
  title: string;
  topics: string[];
  resources: string[];
  keywords: string[];
}

function parseCurriculum(text: string): Curriculum {
  const lines = text.split('\n');
  const curriculum: Curriculum = {};
  let currentWeek: { title: string; lessons: Lesson[] } | null = null;
  let currentLesson: Lesson | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('-week')) {
      const weekTitle = trimmedLine.slice(6).trim();
      currentWeek = { title: weekTitle, lessons: [] };
      curriculum[`week${Object.keys(curriculum).length + 1}`] = currentWeek;
    } else if (trimmedLine.startsWith('-lesson')) {
      const lessonTitle = trimmedLine.slice(7).trim();
      currentLesson = { title: lessonTitle, topics: [], resources: [], keywords: [] };
      currentWeek?.lessons.push(currentLesson);
    } else if (trimmedLine.startsWith('-topics')) {
      const topics = trimmedLine.slice(7).trim().split(', ');
      if (currentLesson) currentLesson.topics = topics;
    } else if (trimmedLine.startsWith('-resources')) {
      const resources = trimmedLine.slice(10).trim().split(', ');
      if (currentLesson) currentLesson.resources = resources;
    } else if (trimmedLine.startsWith('-search keywords')) {
      const keywords = trimmedLine.slice(15).trim().split(', ');
      if (currentLesson) currentLesson.keywords = keywords;
    }
  }

  return curriculum;
}
const searchYouTube = async (keywords: string[]) => {
  const query = keywords.join(' ');
  try {
    const response = await axios.get(YOUTUBE_SEARCH_URL, {
      params: {
        part: 'snippet',
        maxResults: 1,
        q: query,
        type: 'video',
        key: APIKeys.googleAPIKey,
      },
    });

    if (response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log(`Top video for keywords "${query}": ${videoUrl}`);
      // You can set the video URL to the state or do something else with it
    } else {
      console.log('No videos found for the given keywords');
    }
  } catch (error) {
    console.error('Failed to fetch videos from YouTube', error);
  }
};

const CurriculumGenerator = () => {
  const [projectName, setName] = useState("");
  const [timeline, setTimeline] = useState("");
  const [projectSummary, setProjectSummary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [numClassesPerWeek, setNumClassesPerWeek] = useState("1");
  const [classDays, setClassDays] = useState(["", "", ""]);
  const [curriculum, setCurriculum] = useState("");
  const [keywords, setKeywords] = useState(["", "", "", "", ""]); //THIS MIGHT NEED SOME CHANGE
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string | null>(null);

  const classDaysOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
    // ... add other days as needed
  ];
  const handleClassDaysChange = (
    selectedOptions: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const selectedDays = selectedOptions.map((option) => option.value);
    if (selectedDays.length > parseInt(numClassesPerWeek)) {
      setError(`You can only select up to ${numClassesPerWeek} class days.`);
    } else {
      setError("");
      setClassDays(selectedDays);
    }
  };
  
  const navigate = useNavigate();
  const saveCurriculum = useMutation(api.myFunctions.saveCurriculum);

  const generateCurriculum = async () => {
    setIsLoading(true); // Start loading
    const prompt = `
    [INST]
      Generate a detailed curriculum plan based on the following details:
      - Project name: ${projectName} 
      - Timeline: ${timeline} (the lenth of the course)
      - Project Summary: ${projectSummary} (details of what the project is and what it includes)
      - Experience Level: ${experienceLevel} (student's experience level)
      - hours spent every week: ${numClassesPerWeek} (hours in class every week)
      - Class Days: ${classDays.join(", ")} (the days the class is held)
      Provide a breakdown of topics, sessions, and resources for material preparation.
      distruibute the material based on the number of hours that is being spent in the subject between the number of classes there is in one week.
      For the resources, return keywords for each session that can be searched on YouTube using the YouTube API.
      Format the keywords like this: "Keywords for YouTube: keyword1, keyword2, keyword3".
      return the result in this format as a JSON FILE:

       title of the project 
        -week 1: title
        -lesson 1: 
          -topics
          -resources
          -search keywords
        -lesson 2:
          -topics
          -resources
          -search keywords
          .
          .(continue the number of lessons based on the number of classes per week)
          .
        -week 2: title
        -topics
        -resources
        -search keywords
        .
        .
        .(continue the number of weeks based on the inital given timeline based on the number of classes per week)

    [/INST]
    `;

    const options = {
      method: "POST",
      url: "https://api.together.xyz/inference",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + APIKeys.TogetherAPIKey,
      },
      data: {
        model: "togethercomputer/llama-2-13b-chat",
        prompt: prompt,
        max_tokens: 2635,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
      },
    };

    try {
      const response = await axios.request(options);
      const generatedText: string = response.data.output.choices[0].text;
      console.log(generatedText);
      setCurriculum(generatedText);

      const keywordsLine =
        generatedText
          .split("\n")
          .find((line) => line.startsWith("Keywords for YouTube:")) || "";
      const extractedKeywords: string[] = keywordsLine
        .substring(22)
        .split(",")
        .map((keyword) => keyword.trim());
      setKeywords(extractedKeywords);
      searchYouTube(keywords);
      await saveCurriculum({ description: generatedText });
    } catch (error) {
      setError("Failed to generate curriculum");
    } finally {
      setIsLoading(false); // Set loading indicator to false
      if(!isLoading){
        navigate('/curriculum');
      }
        
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Curriculum Generator</h2>
      {/* Add a loading bar style or spinner in loading.css */}
      {isLoading && <div className="loading-bar" />}
      <div>
        <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <br />
      <div>
        <label>
          Timeline:
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />
        </label>
      </div>
      <br />
      <div>
        <label>
          Project Summary:
          <textarea
            value={projectSummary}
            onChange={(e) => setProjectSummary(e.target.value)}
          />
        </label>
      </div>
      <br />
      <div>
        <label>
          Experience Level:
          <input
            type="text"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          />
        </label>
      </div>
      <br />
      <div>
        <label>
          Number of Classes per Week:
          <select
            value={numClassesPerWeek}
            onChange={(e) => setNumClassesPerWeek(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            {/* Add more options as needed */}
          </select>
        </label>
      </div>
      <br />
      <div>
        <label>
          Class Days:
          <Select
            options={classDaysOptions}
            isMulti
            value={classDaysOptions.filter((option) =>
              classDays.includes(option.value)
            )}
            onChange={handleClassDaysChange}
            closeMenuOnSelect={false}
          />
        </label>
      </div>
      <button onClick={generateCurriculum}>Generate Curriculum</button>
      {curriculum && (
        <div>
          <h3>Curriculum:</h3>
          <p>{curriculum}</p>
        </div>
      )}
      {youtubeVideoUrl && (
        <div>
          <h3>Top YouTube Video:</h3>
          <a href={youtubeVideoUrl} target="_blank" rel="noopener noreferrer">
            Watch Video
          </a>
        </div>
      )}
      {keywords.length > 0 && (
        <div>
          <h3>YouTube Keywords:</h3>
          <ul>
            {keywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <div style={{ color: "hsl(347, 60%, 59%)" }}>{error}</div>}
    </div>
  );
};

export default CurriculumGenerator;