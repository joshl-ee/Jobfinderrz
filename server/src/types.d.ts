export type JobDescription = {
    title?: string,
    location?: string,
    id?: string,
    datePosted?: string,
    description?: string,
    link?: string,
}

export type JobConfig = {
    postingSite: string,
    baseSite: string,
    jobTile: string,
    details: JobDescription;
};
  
export type JobsConfig = {
    [company: string]: JobConfig;
};

export type CompanyJobs = {
    name: string,
    jobDescriptions: JobDescription[],
    error?: string,
}

