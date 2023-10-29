
 
type Request = {
  model: string;
  prompt: string;
  temperature: number;
  numCompletions: number;
  maxTokens: number;
  topKPerToken: number;
  stopSequences?: string[];
  echoPrompt: boolean;
  topP: number;
};

type Token = {
  text: string;
  logprob: number;
  topLogprobs: { [key: string]: number };
};

type Sequence = {
  text: string;
  logprob: number;
  tokens: Token[];
  finishReason?: { reason: string };
};

type RequestResult = {
  success: boolean;
  cached: boolean;
  error?: string;
  completions: Sequence[];
  embedding: any[];
  requestTime?: number;
  batchSize?: number;
  batchRequestTime?: number;
};

class TogetherClient {
  private static INFERENCE_ENDPOINT = "https://api.together.xyz/api/inference";
  private static RETRIEVE_JOB_MAX_WAIT_SECONDS = 60;

  private api_key: string | null;
  private cache: Map<string, RequestResult>; // Placeholder for caching logic

  constructor(apiKey: string | null) {
    this.api_key = apiKey;
    this.cache = new Map();
  }

  private static convertToRawRequest(request: Request): any {
    const rawRequest = {
      request_type: "language-model-inference",
      model: "togethercomputer/Llama-2-7B-32K-Instruct",
      prompt: request.prompt,
      temperature: request.temperature,
      n: request.numCompletions,
      max_tokens: request.maxTokens,
      best_of: request.topKPerToken,
      logprobs: request.topKPerToken,
      stop: request.stopSequences || null,
      echo: request.echoPrompt,
      top_p: request.topP,
      
    };
    console.log("Converted Raw Request:", rawRequest);
    return rawRequest;//this.rewriteRawRequestForModelTags(rawRequest, request.modelEngine);
  }

  private static rewriteRawRequestForModelTags(rawRequest: any, model: string): any {
    // Implement your logic for rewriting the raw request based on model tags
    return rawRequest;
  }

  private getJobUrl(jobId: string): string {
    return `https://api.together.xyz/jobs/job/${jobId}`;
  }

  private makeCacheKey(rawRequest: any, request: Request): string {
    // Implement cache key generation
    return JSON.stringify({ rawRequest, request });
  }
  private async submitJob(request: any, headers: any): Promise<string> {
    try {
      const response = await fetch(TogetherClient.INFERENCE_ENDPOINT, {method: 'POST', headers: new Headers(headers), body: JSON.stringify(request)});
      const data = await response.json()
      if (!data.id) {
        throw new Error("Job ID not found in submission response");
      }
      return data.id;
    } catch (error) {
      console.error('Error submitting job:', error);
      throw new Error('Failed to submit job');
    }
  }

  private async retrieveJob(jobId: string, headers: any): Promise<RequestResult> {
    try {
      const response = await fetch(this.getJobUrl(jobId), {method: 'GET', headers: new Headers(headers)});//axios.get(this.getJobUrl(jobId), { headers });
      const data = await response.json();

      if (data.status === 'failed') {
        throw new Error('Job failed');
      } else if (data.status !== 'finished') {
        throw new Error('Job not finished');
      }

      if (!data.output || !data.output.choices) {
        throw new Error('Invalid job output');
      }

      const completions: Sequence[] = data.output.choices.map((rawCompletion: any) => {
        // Convert from raw completion to Sequence
        const tokens = rawCompletion.text.split(' ').map((text: string) => ({ text, logprob: 0, topLogprobs: {} }));
        return {
          text: rawCompletion.text,
          logprob: 0,
          tokens: tokens,
          finishReason: rawCompletion.finish_reason ? { reason: rawCompletion.finish_reason } : undefined,
        };
      });

      return {
        success: true,
        cached: false,
        completions: completions,
        embedding: [],
        requestTime: data.request_time,
      };
    } catch (error) {
      console.error('Error retrieving job:', error);
      throw new Error('Failed to retrieve job');
    }
  }
  async makeRequest(request: Request): Promise<RequestResult | undefined> {
    const rawRequest = TogetherClient.convertToRawRequest(request);
    const cacheKey = this.makeCacheKey(rawRequest, request);
    console.log(rawRequest);
    console.log(this.api_key);
    if (!this.api_key) {
      throw new Error("Together API key not set");
    }

    const headers = { Authorization: `Bearer ${this.api_key}` };
    console.log(headers);

    // Check cache
    const cachedResult = this.cache.get(cacheKey);
    console.trace("getting cache", {cacheKey, cachedResult});
    if (cachedResult) {
      return cachedResult;
    }
    

    if (request.model in MODEL_ALIASES) {
      // Async handling (not fully implemented)
        // Async handling
        try {
          const jobId = await this.submitJob(rawRequest, headers);
          const result = await this.retrieveJob(jobId, headers);
          console.trace("setting cache", { cacheKey, result })
          this.cache.set(cacheKey, result);
          return result;
        } catch (error) {
          console.error('Async request failed:', error);
          return {
            success: false,
            cached: false,
            error: 'Failed to make async Together request',
            completions: [],
            embedding: [],
          };
        }  
    } else {
      // Sync handling
      try {
        const response = await fetch(TogetherClient.INFERENCE_ENDPOINT, {method: 'POST', headers: new Headers(headers), body: JSON.stringify(rawRequest)}); //axios.post(TogetherClient.INFERENCE_ENDPOINT, rawRequest, { headers });
        const result = await response.json();
        console.log(result);
        console.log(response);
        if (!result.output) {
          throw new Error("No output in Together response");
        }

        if (result.output.error) {
          throw new Error(`Together request failed with error: ${result.output.error}`);
        }

        const completions: Sequence[] = result.output.choices.map((rawCompletion: any) => {
          // Convert from raw completion to Sequence
          const tokens = rawCompletion.text.split(' ').map((text: string) => ({ text, logprob: 0, topLogprobs: {} }));
          return {
            text: rawCompletion.text,
            logprob: 0,
            tokens: tokens,
            finishReason: rawCompletion.finish_reason ? { reason: rawCompletion.finish_reason } : undefined,
          };
        });

        const requestResult: RequestResult = {
          success: true,
          cached: false,
          completions: completions,
          embedding: [],
          requestTime: result.request_time,
        };

        // Update cache
        console.trace("setting cache", { cacheKey, requestResult })
        this.cache.set(cacheKey, requestResult);

        return requestResult;
      } catch (error) {
        console.error('Together request failed:', error);
        return {
          success: false,
          cached: false,
          error: 'Failed to make Together request',
          completions: [],
          embedding: [],
        };
      }
    }
  }
}

const MODEL_ALIASES: { [key: string]: string } = {
  model: 'togethercomputer/Llama-2-7B-32K-Instruct',
};

export default TogetherClient;
