import { Page } from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { CompanyConfigs } from '../configs';
import * as Types from  '../types/jobs';
import { Handler, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda()

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    const companyConfig: Types.CompanyConfig = event.companyConfig

    // Open browser
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
        timeout: 60000
        })

    try {
        const page = await browser.newPage();

        // Debug logs for the page
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        // Page settings for User Agent and Default Timeout
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537');
        page.setDefaultTimeout(0);

        const JobPostings = await scrapeJobs(companyConfig, page)
        return JobPostings
    }
    catch (error) {
        console.error(error)
        return
    }
    finally {
        await browser.close()
    }
}

// Function to scrape the jobs on a site. The companies and configuration are set in config.
async function scrapeJobs(config: Types.CompanyConfig, page: Page): Promise<Types.JobPosting[]> {
    const URL = config.postingSite;
    console.log('postingSite: ' + URL);

    try {
        
        await page.goto(URL, { waitUntil: 'domcontentloaded' });
        console.log('page loaded');

        await page.waitForSelector(config.jobTile, { timeout: 45000 });
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
                const job: Types.JobPosting = {};

                for (const [property, selector] of Object.entries(configDetails)) {
                    if (selector) {
                        console.log('property: ' + property);
                        if (property === 'link') {
                            const linkElement = jobDetail.querySelector(selector) as HTMLAnchorElement;
                            job[property as keyof Types.JobPosting] = linkElement ? config.baseSite + linkElement.getAttribute('href')! : '';
                        }
                        else job[property as keyof Types.JobPosting] = jobDetail.querySelector(selector)?.textContent || '';
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