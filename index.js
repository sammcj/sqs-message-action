const process = require('process');
const core = require('@actions/core');
const aws = require('aws-sdk');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html

async function run() {
  try {
    // determine if we are running on github actions
    const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

    // if running locally read the inputs from the environment
    const sqsUrl = isGithubActions
      ? core.getInput('sqs-url', { required: true })
      : process.env.SQS_URL;
    const message = isGithubActions
      ? core.getInput('message', { required: true })
      : process.env.MESSAGE;
    const messageGroupId = isGithubActions
      ? core.getInput('message-group-id', { required: false })
      : process.env.MESSAGE_GROUP_ID;
    const messageAttributes = isGithubActions
      ? core.getInput('message-attributes', { required: false })
      : process.env.MESSAGE_ATTRIBUTES;
    const region = isGithubActions
      ? core.getInput('region', { required: false })
      : process.env.REGION;
    const stringifyMessage = isGithubActions
      ? core.getInput('stringify-message', { required: false, default: true })
      : process.env.STRINGIFY_MESSAGE;

    if (message === '') {
      throw new Error('Message cannot be an empty string');
    }

    // If any of the required inputs are missing or an empty string, throw an error
    if (sqsUrl === '' || message === '') {
      console.log(`sqsUrl: ${sqsUrl}, message: ${message}`);
      throw new Error('You must provide at least a valid SQS URL and a message');
    }

    // Construct the parameters
    const params = {
      QueueUrl: sqsUrl,
      MessageBody: stringifyMessage ? JSON.stringify(message) : message,
      MessageGroupId: messageGroupId,
    };

    // If message attributes are provided, add them to the params object
    if (messageAttributes) {
      params.MessageAttributes = JSON.parse(messageAttributes);
      core.setOutput('message-attributes', params.MessageAttributes);
    }

    // Set outputs that may be useful for debugging
    core.setOutput('message-body', params.MessageBody);
    core.setOutput('queue-url', params.sqsUrl);

    // Create a new SQS service object, if running locally, stub out the SQS client
    const sqs = isGithubActions
      ? new aws.SQS()
      : new aws.SQS({ endpoint: 'http://localhost:4566', region: region });

    // Send the message to the queue and log the response
    sqs.sendMessage(params, (err, resp) => {
      if (err) {
        throw err;
      } else {
        console.log(`resp ${JSON.stringify(resp, null, 2)}`);
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
  run();
}
