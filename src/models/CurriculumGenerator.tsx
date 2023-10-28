import React, { useState } from 'react';
import axios from 'axios';
import { api } from "../../convex/_generated/api"
import { APIKeys } from '@/components/Keys/keys';
import { useMutation } from 'node_modules/convex/dist/esm-types/react';
import { saveCurriculum } from 'convex/myFunctions';

interface CurriculumProps {
  timeline: string;
  projectSummary: string;
  experienceLevel: string;
  numClassesPerWeek: number;
  classDays: string[];
}

const CurriculumGenerator: React.FC<CurriculumProps> = ({
  timeline,
  projectSummary,
  experienceLevel,
  numClassesPerWeek,
  classDays,
}) => {
  const [curriculum, setCurriculum] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateCurriculum = async () => {
    const prompt = `
      Generate a detailed curriculum plan based on the following details:
      - Timeline: ${timeline}
      - Project Summary: ${projectSummary}
      - Experience Level: ${experienceLevel}
      - Number of Classes per Week: ${numClassesPerWeek}
      - Class Days: ${classDays.join(', ')}
      Provide a breakdown of topics, sessions, and resources for material preparation.
      For the resources, return keywords for each session that can be searched on YouTube using the YouTube API.
      Format the keywords like this: "Keywords for YouTube: keyword1, keyword2, keyword3".
    `;

    const options = {
      method: 'POST',
      url: 'https://api.together.xyz/instances/start',
      params: { model: 'username/ft-model-name' },  // Replace with your actual model name
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + APIKeys.togetherAPIKey,  // Replace with your actual API key
      },
      data: {
        prompt,
        max_tokens: 1000,
      },
    };

    try {
      const response = await axios.request(options);
      const generatedText = response.data.choices[0].text as string;
      setCurriculum(generatedText);

      const keywordsLine = generatedText.split('\n').find(line => line.startsWith('Keywords for YouTube:')) || '';
      const extractedKeywords = keywordsLine.substring(22).split(',').map(keyword => keyword.trim());
      const saveCurriculum = useMutation(api.myFunctions.saveCurriculum)
      setKeywords(extractedKeywords);
    } catch (error) {
      setError('Failed to generate curriculum');
      console.error(error);
    }
  };
 
  return (
    <div>
      <button onClick={generateCurriculum}>Generate Curriculum</button>
      {saveCurriculum.toString() && <div><h3>Curriculum:</h3><p>{curriculum}</p></div>}
      {keywords.length > 0 && <div><h3>YouTube Keywords:</h3><ul>{keywords.map(keyword => <li key={keyword}>{keyword}</li>)}</ul></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default CurriculumGenerator;
