import React, { useState } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { APIKeys } from '../components/Keys/keys';
import { useNavigate } from 'react-router-dom';
import TogetherClient from './TogetherClient';
import { generateCurriculumWithTogether } from '../../convex/myFunctions';

interface OptionType {
  value: string;
  label: string;
}

const CurriculumGenerator = () => {
  const [projectName, setName] = useState('');
  const [timeline, setTimeline] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [numClassesPerWeek, setNumClassesPerWeek] = useState('1');
  const [classDays, setClassDays] = useState(['', '', '']);
  const [curriculum, setCurriculum] = useState('');
  const [keywords, setKeywords] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const saveCurriculum = useMutation(api.myFunctions.saveCurriculum);

  // Initialize TogetherClient
  const togetherClient = new TogetherClient(APIKeys.togetherAPIKey.toString());

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
  

 

  
  
  
  

  const generateCurriculum = useAction(api.myFunctions.generateCurriculumWithTogether);
  const handleGenerateCurriculum = async () => {
    const prompt = `
    [INST]
      Generate a detailed curriculum plan based on the following details:
      - Timeline: ${timeline} (the lenth of the course)
      - Project Summary: ${projectSummary} (details of what the project is and what it includes)
      - Experience Level: ${experienceLevel} (student's experience level)
      - hours spent every week: ${numClassesPerWeek} (hours in class every week)
      - Class Days: ${classDays.join(', ')} (the days the class is held)
      Provide a breakdown of topics, sessions, and resources for material preparation.
      distruibute the material based on the number of hours that is being spent in the subject between the number of classes there is in one week.
      For the resources, return keywords for each session that can be searched on YouTube using the YouTube API.
      Format the keywords like this: "Keywords for YouTube: keyword1, keyword2, keyword3".
      return the result in this format:
      Curriculum: title of the project 
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
      method: 'POST',
      url: 'https://api.together.xyz/inference',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + APIKeys.togetherAPIKey,
      },
      data: {
        model: 'togethercomputer/Llama-2-7B-32K-Instruct',
        prompt: prompt,
        max_tokens: 8192,
        stop: ["[INST]", "</s>"],
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1
      }
    };

    try {
      const request = {
        model: 'togethercomputer/Llama-2-7B-32K-Instruct',
        prompt: prompt,
        temperature: 0.7,
        numCompletions: 1,
        maxTokens: 8192,
        topKPerToken: 50,
        stopSequences: ["[INST]", "</s>"],
        echoPrompt: false,
        topP: 0.7,
      };
      const result = await generateCurriculum(request);
 
      
      const generatedText = result;
      //console.log(generatedText);

      // const response = await axios.request(options);
      // const generatedText: string = response.data.output.choices[0].text;
      // console.log(generatedText);
      //const keywordsLine = generatedText.split('\n').find(line => line.startsWith('Keywords for YouTube:')) || '';
      //const extractedKeywords: string[] = keywordsLine.substring(22).split(',').map(keyword => keyword.trim());
      //setKeywords(extractedKeywords);

      
      // set the curriculum details in the context
      const setCurriculumDetails = `
        Timeline: ${timeline}
        Project Summary: ${projectSummary}
        Experience Level: ${experienceLevel}
        Number of Classes per Week: ${numClassesPerWeek}
        Class Days: ${classDays.join(', ')}
        Curriculum: ${curriculum}
        Extracted Keywords: {extractedKeywords.join(', ')}
      `;

      
      await saveCurriculum({ description: setCurriculumDetails});
      navigate('/curriculum');
      
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
          Project name:
          <input type="text" value={projectName} onChange={e => setName(e.target.value)} />
        </label>
      </div>
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
      <button onClick={handleGenerateCurriculum}>Generate Curriculum</button>
      {curriculum && <div><h3>Curriculum:</h3><p>{curriculum}</p></div>}
      {keywords.length > 0 && <div><h3>YouTube Keywords:</h3><ul>{keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}</ul></div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default CurriculumGenerator;
