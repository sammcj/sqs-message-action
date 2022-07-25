const core = require('@actions/core');
const aws = require('aws-sdk');

async function run() {
  try {
    const sqsUrl = core.getInput('sqs-url', { required: true });
    const message = core.getInput('message', { required: true });
    const messageGroupId = core.getInput('message-group-id', { required: false });
    const messageAttributes = core.getInput('message-attributes', { required: false });

    const params = {
      QueueUrl: sqsUrl,
      MessageBody: message,
      MessageGroupId: messageGroupId,
      MessageAttributes: (typeof messageAttributes === 'undefined') ? undefined : JSON.stringify(Object.fromEntries(messageAttributes)),
    }

    const sqs = new aws.SQS();
    sqs.sendMessage(params, (err, resp) => {
      if (err) {
        throw err;
      } else {
        console.log(`resp ${JSON.stringify(resp, null, 2)}`);
      }
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
  run();
}
