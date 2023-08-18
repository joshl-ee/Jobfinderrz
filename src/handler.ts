import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { Jobs } from './configs';
import * as Types from  './types';
import * as Utility from './utility';
import { Handler, Context, Callback } from 'aws-lambda';

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    const browser = await puppeteer.launch( { headless: 'new' } );

    try {
        // Find jobs for every company in configs.ts.
        const allJobs = await Promise.all(Object.entries(Jobs).map( async ([company, config]) => {
            const page = await browser.newPage();

            // Debug purposes.
            await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537');
            page.setDefaultTimeout(0);

            let jobs: Types.JobDescription[] = [];
            const companyJobs: Types.CompanyJobs = {company: company, jobDescriptions: jobs};
            
            try {
                companyJobs.jobDescriptions = await scrapeJobs(config, page);
            }
            catch (error) {
                companyJobs.error = String(error);
            }
            return companyJobs;
        }));

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(allJobs),
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
