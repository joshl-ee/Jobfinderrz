import { JobPosting } from '../types/jobs'

export function isKeyOfJobDescription(key: string, obj: JobPosting): key is keyof JobPosting {
    return key in obj;
}
  