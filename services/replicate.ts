import { $fetch, FetchError } from 'ohmyfetch'
import { URLS } from '../utils/constants'
// import consola from 'consola'

const BASE_URL = URLS.koda.replicate

type Option<T> = T | null

const api = $fetch.create({
  baseURL: BASE_URL,
})

export type PinningKey = {
  expiry: string
  token: string
}

export type PredictionRequestStatus = {
  created_at: string
  id: string
  input: Input
  logs: Option<string>
  status: string
  version: string
}

export type PredictionRequest = {
  version: string
  input: Input
}

export type PredictionStatus = {
  completed_at: string
  created_at: string
  id: string
  input: Input
  logs: string
  // metrics: string, ?? { "predict_time": 8.760063 }
  output: Array<string>
  started_at: string
  status: string
  // urls: string, ?? { "get": "https://api.replicate.com/v1/predictions/6wkgvnkv2rhrtcjuq722vfp6mq", "cancel": "https://api.replicate.com/v1/predictions/6wkgvnkv2rhrtcjuq722vfp6mq/cancel" }
  version: string
}

export type Input = {
  positive_prompt: string
  width: Option<string>
  height: Option<string>
  num_outputs: Option<string>
  guidance_scale: Option<string>
  num_inference_steps: Option<string>
}

export const predict = async (object: string) => {
  const input: PredictionRequest = {
    version: 'd908d47fa301ffe59dce52588e0603add72bfcbc4bb3f78b4516cac541ba7b2b',
    input: {
      positive_prompt: object,
      width: '512',
      height: '512',
      num_outputs: '1',
      guidance_scale: '7',
      num_inference_steps: '50',
    },
  }
  const value = await api<PredictionRequestStatus>('predict', {
    method: 'POST',
    body: input,
  }).catch((error: FetchError) => {
    throw new Error(
      `[REPLICATE::PREDICT] Unable to PREDICT for reasons ${error.data}`
    )
  })
  return value
}

export const getPrediction = async (
  predictionId: string
): Promise<PredictionStatus> => {
  const prediction = await api<PredictionStatus>(
    `status/${predictionId}`
  ).catch((error: FetchError) => {
    throw new Error(
      `[REPLICATE::STATUS] Unable to GET STATUS for reasons ${error.data}`
    )
  })
  return prediction
}

export default api
