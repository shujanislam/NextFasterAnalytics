import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export const explainErrorLogs = async(logs) => {
  try{
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Read the following logs and give a one liner summary of the logs and also give a one line solution how to fix the error with respect to the status code, url route and all given: ${logs}. Keep the explaination in simple english, don't add any json or anything like that, just plain english`,
    });

    return response.text;
  }
  catch(err : any){
    console.log(err.message);
  }
}
