"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const handler = async (event, context, callback) => {
    // TODO: need to handle pagination
    const URLS = [
        'https://www.amazon.jobs/en/teams/jobs-for-grads',
        //'https://www.metacareers.com/careerprograms/students/?p[teams][0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][1]=Internship%20-%20Business&p[teams][2]=Internship%20-%20PhD&p[teams][3]=University%20Grad%20-%20PhD%20%26%20Postdoc&p[teams][4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&p[teams][5]=University%20Grad%20-%20Business&teams[0]=Internship%20-%20Engineering%2C%20Tech%20%26%20Design&teams[1]=Internship%20-%20Business&teams[2]=Internship%20-%20PhD&teams[3]=University%20Grad%20-%20PhD%20%26%20Postdoc&teams[4]=University%20Grad%20-%20Engineering%2C%20Tech%20%26%20Design&teams[5]=University%20Grad%20-%20Business#openpositions',
    ];
    try {
        // Use Promise.all to await all the promises
        const allJobTitles = await Promise.all(URLS.map(scrapeJobTitles));
        // Flatten the array of arrays
        const jobTitles = allJobTitles.flat();
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(jobTitles),
        });
    }
    catch (error) {
        console.error(`An error occurred: ${error}`);
        callback(`An error occurred while scraping the job titles: ${error}`, {
            statusCode: 500,
            body: JSON.stringify('An error occurred while scraping the job titles.'),
        });
    }
};
exports.handler = handler;
// This function takes a URL and returns a promise with all the job titles from that URL
async function scrapeJobTitles(URL) {
    const jobTitles = [];
    const response = await axios_1.default.get(URL);
    const $ = cheerio_1.default.load(response.data);
    //console.log(response.data);
    $('div.job-tile').each((index, element) => {
        const title = $(element).find('h3.job-title').text();
        console.log('job found');
        jobTitles.push(title);
    });
    return jobTitles;
}
async function scrapeAmazonJobs() {
    const browser = await puppeteer_1.default.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.jobs/en/teams/jobs-for-grads');
    // You may need to add specific waits here to ensure the content has loaded
    await page.waitForSelector('.job-tile');
    const jobs = await page.evaluate(() => {
        // Replace the selector with the correct one for the job listings
        const jobElements = document.querySelectorAll('.job-tile');
        return Array.from(jobElements).map(job => job.textContent);
    });
    await browser.close();
    return jobs;
}
scrapeAmazonJobs().then(jobs => {
    console.log(jobs); // Prints the job listings
});
