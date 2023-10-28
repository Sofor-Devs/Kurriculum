import React, {useState} from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
import axios from 'axios';
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { APIKeys } from '../components/Keys/keys';

interface OptionType {
  value: string;
  label: string;
}

const CurriculumGenerator = () => {
  const [timeline, setTimeline] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [numClassesPerWeek, setNumClassesPerWeek] = useState('1');
  const [classDays, setClassDays] = useState(['','','']);
  const [curriculum, setCurriculum] = useState('');
  const [keywords, setKeywords] = useState(['','','','','']); //THIS MIGHT NEED SOME CHANGE
  const [error, setError] = useState('');

   const classDaysOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
    // ... add other days as needed
  ];
  const handleClassDaysChange = (
    selectedOptions: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    const selectedDays = selectedOptions.map(option => option.value);
    if (selectedDays.length > parseInt(numClassesPerWeek)) {
      setError(`You can only select up to ${numClassesPerWeek} class days.`);
    } else {
      setError('');
      setClassDays(selectedDays);
    }
  };
  

 

  const saveCurriculum = useMutation(api.myFunctions.saveCurriculum);
  
  
  

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
      url: 'https://api.together.xyz/inference',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + APIKeys.togetherAPIKey,
      },
      data: {
        model: 'togethercomputer/llama-2-13b-chat',
        prompt: prompt,
        max_tokens: 8196,
        stop: '.',
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1
      }
    };

    try {
      const response = await axios.request(options);
      const generatedText: string = response.data.output.choices[0].text;
      setCurriculum(generatedText);

      const keywordsLine = generatedText.split('\n').find(line => line.startsWith('Keywords for YouTube:')) || '';
      const extractedKeywords: string[] = keywordsLine.substring(22).split(',').map(keyword => keyword.trim());
      setKeywords(extractedKeywords);

      await saveCurriculum({ description: generatedText });
    } catch (error) {
      setError('Failed to generate curriculum');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Curriculum Generator</h2>
      <div>
        <label>
          Timeline:
          <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Project Summary:
          <textarea value={projectSummary} onChange={e => setProjectSummary(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Experience Level:
          <input type="text" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Number of Classes per Week:
          <select value={numClassesPerWeek} onChange={e => setNumClassesPerWeek(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            {/* Add more options as needed */}
          </select>
        </label>
      </div>
      <div>
      <label>
          Class Days:
          <Select 
            options={classDaysOptions} 
            isMulti
            value={classDaysOptions.filter(option => classDays.includes(option.value))}
            onChange={handleClassDaysChange}
            closeMenuOnSelect={false}
          />
        </label>
      </div>
      <button onClick={generateCurriculum}>Generate Curriculum</button>
      {curriculum && <div><h3>Curriculum:</h3><p>{curriculum}</p></div>}
      {keywords.length > 0 && <div><h3>YouTube Keywords:</h3><ul>{keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}</ul></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default CurriculumGenerator;
