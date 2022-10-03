const core = require('@actions/core');
const aws = require('aws-sdk');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html

async function run() {
  try {
    const sqsUrl = core.getInput('sqs-url', { required: true });
    const message = core.getInput('message', { required: true });
    const messageGroupId = core.getInput('message-group-id', { required: false });
    const messageAttributes = core.getInput('message-attributes', { required: false });

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
      MessageBody: message,
      MessageGroupId: messageGroupId,
    };

    // If message attributes are provided, add them to the params object
    if (messageAttributes) {
      params.MessageAttributes = JSON.parse(messageAttributes);
    }

    // Create a new SQS service object
    const sqs = new aws.SQS();

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
