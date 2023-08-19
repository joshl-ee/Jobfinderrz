import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { Jobs } from './configs';
import * as Types from  './types';
import * as Utility from './utility';
import { Handler, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    const browser = await puppeteer.launch( { headless: 'new' } );

    try {

        // Return the most recent jobs for all companies listed in configs.ts
        const allJobs = await Promise.all(Object.entries(Jobs).map( async ([company, config]) => {
            const page = await browser.newPage();

            // Debug logs for the page
            await page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            // Page settings for User Agent and Default Timeout
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537');
            page.setDefaultTimeout(0);

            // Structures to hold scraped jobs
            let jobs: Types.JobDescription[] = [];
            const companyJobs: Types.CompanyJobs = {name: company, jobDescriptions: jobs};
            
            // Scrape jobs
            try {
                companyJobs.jobDescriptions = await scrapeJobs(config, page);
            }
            catch (error) {
                companyJobs.error = String(error);
            }
            return companyJobs;
        }));

        // Process found jobs on DynamoDB
        const newJobs = await processJobs(allJobs);

        // Send new jobs as text messages
        
        
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(newJobs),
        });

    } catch (error) {
        console.error(error);
        callback(`An error occurred while scraping the job titles: ${error}`, {
            statusCode: 500,
            body: JSON.stringify('An error occurred while scraping the job titles.'),
        });
    } finally {
        await browser.close();
    }
};

// Function to process the jobs on DynamoDB. Postings that do not exist already in the DB are returned.
async function processJobs(companyJobsArr: Types.CompanyJobs[]): Promise<Types.CompanyJobs[]> {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const newJobs: Types.CompanyJobs[] = [];

    console.log("DynamoDB configured");

    // Iterate over each company
    for (const companyIndex in companyJobsArr) {
        const company = companyJobsArr[companyIndex];
        const companyName = company.name;
        const newCompanyJobs: Types.CompanyJobs = {name: companyName, jobDescriptions: []};
        console.log("Processing " + companyName + " jobs");

        // Iterate over each job
        for (const job of company.jobDescriptions) {

            const descriptionValue = JSON.stringify(job);
            console.log(descriptionValue);
            const params: AWS.DynamoDB.DocumentClient.QueryInput = {
                TableName: 'JobsTable',
                KeyConditionExpression: '#PK = :descriptionValue AND #SK = :companyName',
                ExpressionAttributeNames: {
                    '#PK': 'description',
                    '#SK': 'company'
                },
                ExpressionAttributeValues: {
                    ':descriptionValue': descriptionValue ,
                    ':companyName': companyName 
                }
            };

            // Check if job exists in DynamoDB
            const result = await dynamodb.query(params).promise();
            console.log('Get called on job');
            if (result.Items && result.Items.length === 0) {
                console.log("Job doesn't exist in DynamoDB");

                // If not, add it to DynamoDB
                const putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
                    TableName: 'JobsTable', 
                    Item: {
                        description: descriptionValue,
                        company: companyName,
                        title: job.title || '',
                        time: new Date().toISOString()
                    }
                };

                await dynamodb.put(putParams).promise();
                console.log("Put job in DynamoDB");

                // Add job to the newCompanyJob object
                newCompanyJobs.jobDescriptions.push(job);
            }
        }
        newJobs.push(newCompanyJobs);
    }
    return newJobs;
}

// Function to scrape the jobs on a site. The companies and configuration are set in config.
async function scrapeJobs(config: Types.JobConfig, page: Page): Promise<Types.JobDescription[]> {
    const URL = config.postingSite;
    console.log('postingSite: ' + URL);

    try {
        
        await page.goto(URL, { waitUntil: 'domcontentloaded' });
        console.log('page loaded');

        await page.waitForSelector(config.jobTile);
        console.log('first selector');

        const jobs = await page.evaluate((config) => {
            console.log('looking for jobs');
            const jobDetails = document.querySelectorAll(config.jobTile);


            if (jobDetails.length === 0) {
                console.log('no jobs found');
                throw new Error('No jobs found');
            }

            return Array.from(jobDetails).map(jobDetail => {
                console.log('building ' + jobDetails.length + ' jobs');
                const configDetails = config.details;
                const job: Types.JobDescription = {};

                for (const [property, selector] of Object.entries(configDetails)) {
                    if (selector) {
                        console.log('property: ' + property);
                        if (property === 'link') {
                            const linkElement = jobDetail.querySelector(selector) as HTMLAnchorElement;
                            job[property as keyof Types.JobDescription] = linkElement ? config.baseSite + linkElement.getAttribute('href')! : '';
                        }
                        else job[property as keyof Types.JobDescription] = jobDetail.querySelector(selector)?.textContent || '';
                    }
                }
                return job;
            });
        }, config);

        return jobs;
    } catch (error) {
        throw error;
    };
}
