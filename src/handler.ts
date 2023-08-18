import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

import { Handler, Context, Callback } from 'aws-lambda';

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    const browser = await puppeteer.launch( { headless: 'new' } );
    const page = await browser.newPage();
    page.setDefaultTimeout(0);

    // TODO: need to handle pagination
    const URLS: string[] = [
        'https://www.amazon.jobs/en/teams/jobs-for-grads',
        //'https://www.metacareers.com/careerprograms/students/?p[teams][0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][1]=Internship%20-%20Business&p[teams][2]=Internship%20-%20PhD&p[teams][3]=University%20Grad%20-%20PhD%20%26%20Postdoc&p[teams][4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][5]=University%20Grad%20-%20Business&teams[0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&teams[1]=Internship%20-%20Business&teams[2]=Internship%20-%20PhD&teams[3]=University%20Grad%20-%20PhD%20%26%20Postdoc&teams[4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&teams[5]=University%20Grad%20-%20Business#openpositions',
    ];

    try {
        // Use Promise.all to await all the promises
        const allJobTitles = await Promise.all(URLS.map(url => scrapeJobs(url, page)));

        // Flatten the array of arrays
        const jobTitles = allJobTitles.flat();

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(jobTitles),
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

async function scrapeJobs(URL: string, page: Page): Promise<string[]> {
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    
    await page.waitForSelector('.job-tile');

    const jobs = await page.evaluate(() => {
      // Replace the selector with the correct one for the job listings
      const jobElements = document.querySelectorAll('.job-tile');
      return Array.from(jobElements).map(job => job.textContent || '');
    });
    
    return jobs;
}
