export type JobPosting = {
    title?: string,
    location?: string,
    id?: string,
    datePosted?: string,
    description?: string,
    link?: string,
}

export type CompanyConfig = {
    company: string,
    postingSite: string,
    baseSite: string,
    jobTile: string,
    details: JobPosting;
};


export type CompanyJobs = {
    name: string,
    jobDescriptions: JobPosting[],
    error?: string,
}

