import { JobDescription } from './types'

export function isKeyOfJobDescription(key: string, obj: JobDescription): key is keyof JobDescription {
    return key in obj;
}
  