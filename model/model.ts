import { genChat } from 'dev-ai-sdk';

const ai = new genChat({
  google: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
  },
});

export const explainErrorLogs = async (logs: any): Promise<string> => {
	try {
		const error_response = await ai.generate({
			google: {
				model: 'gemini-2.5-flash',
				prompt: `Read the following logs and give a one liner summary of the logs and also give a one line solution how to fix the error with respect to the status code, url route and all given: ${logs}. Keep the explaination in simple english, don't add any json or anything like that, just plain english. add both lines together, no need to add any paragraph change and headers at all. just keep them one after another.`,
				maxTokens: 500,
			},
		});

		return String(error_response ?? 'An error occurred while generating the explanation.');
	} catch (err: any) {
		console.log(err.message);
		return 'An error occurred while generating the explanation.';
	}
};
