import { CompanyConfigs } from './configs';
import * as Types from  './types/jobs';
import { Handler, Context, Callback } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const sns = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda({
    endpoint: process.env.DEBUG
    ? 'http://localhost:3002'
    : 'https://lambda.us-east-1.amazonaws.com',
})

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    try {

        // Return the most recent jobs for all companies listed in configs.ts
        const jobsByCompany: Promise<any>[] = CompanyConfigs.map(async (companyConfig) => {    
            // Structures to hold scraped jobs
            let jobs: Types.JobPosting[] = [];
            const companyJobs: Types.CompanyJobs = { name: companyConfig.company, jobDescriptions: jobs };

            // Scrape jobs
            try {
                const invokeParams = {
                    FunctionName: 'Jobfinderrz-dev-scrape',
                    InvocationType: 'Event',
                    Payload: JSON.stringify({ companyConfig })
                }
                return lambda.invoke(invokeParams).promise();
            }
            catch (error) {
                companyJobs.error = String(error);
                return Promise.reject(companyJobs.error); // return a rejected Promise
            }
        })

        
        jobsByCompany.forEach((promise, index) => {
            promise
              .then(companyJobs => {
                // Need to put this somewhere
                processJobs(companyJobs)
              })
              .catch(reason => {
                console.log(`Processing jobs for ${CompanyConfigs[index].company} failed with reason:`, reason);
              });
        });

        // REFER TO: https://chat.openai.com/share/54463d0f-40e4-41a5-ab19-131d813b26df

        // Process found jobs on DynamoDB
        // const newJobs = await processJobs(allJobs);

        // Send new jobs as text messages
        // await sendNotifcation(newJobs);
        
        // callback(null, {
        //     statusCode: 200,
        //     body: JSON.stringify(newJobs),
        // });

        callback(null, {
            statusCode: 200,
            body: JSON.stringify("done"),
        });

    } catch (error) {
        console.error(error);
        callback(`An error occurred while scraping the job titles: ${error}`, {
            statusCode: 500,
            body: JSON.stringify('An error occurred while scraping the job titles.'),
        });
    }
};

// Function to send notifications of new jobs
async function sendNotifcation(newJobsArr: Types.CompanyJobs[]) {

    let message = '';

    let jobsFound = false;

    for (const companyIndex in newJobsArr) {
        const company = newJobsArr[companyIndex];
        const companyName = company.name;

        if (company.jobDescriptions.length > 0) message += `New jobs at ${companyName}:\n`;
        company.jobDescriptions.forEach((job) => {
            if (!jobsFound) jobsFound = true;
            if (job.title) {
                message += `  - Title: ${job.title}\n`;
                if (job.link) message += `  - Link: ${job.link}\n`;
            }
        });
        message += '\n';
    }
    
    const params: AWS.SNS.PublishInput = {
        Subject: 'New jobs - ' + new Date().toISOString(),
        Message: message,
        TopicArn: 'arn:aws:sns:us-east-1:693609258176:JobFinderrz'
    };
        
    if (jobsFound) {
        try {
            const result = await sns.publish(params).promise();
            console.log('Message sent successfully', result.MessageId);
        } catch (error) {
            console.error('Error sending message', error);
        }
    }   
}


// Function to process the jobs on DynamoDB. Postings that do not exist already in the DB are returned.
async function processJobs(companyJobsArr: Types.CompanyJobs[]): Promise<Types.CompanyJobs[]> {
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
                    ':descriptionValue': descriptionValue,
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

