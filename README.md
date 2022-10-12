# SQS Message Action

This action will publish a message to an AWS SQS queue.

## Inputs

- `sqs-url` - The URL of the SQS queue to publish to (required).
- `message` - The message to publish (required).
- `message-group-id` - The message group ID to publish to (optional).
- `message-attributes` - A map of message attributes to publish (optional).

## Usage

Assuming your runner has access to the required AWS resources.

### As part of an automated pipeline

```yaml
name: Send an SQS Message
on:
  push:
    branches:
      - main
- uses: sammcj/sqs-message-action@main
  with:
    sqs-url: https://sqs.ap-southeast-2.amazonaws.com/<account-id>/<queue-name>
    message: "Hello World"
    message-group-id: "12345"
    message-attributes: '{"key1": {"DataType": "String", "StringValue": "value1" }}'
    stringify-message: true
```

### Using workflow_dispatch to take input from the user

```yaml
name: Send an SQS Message
on:
  workflow_dispatch:
    inputs:
      sqs-url:
        description: 'e.g. https://sqs.ap-southeast-2.amazonaws.com/<AWS ID>/<queue-name>.fifo'
        default: 'https://sqs.ap-southeast-2.amazonaws.com/1234567890/my-sqs-queue.fifo'
        required: true
        type: string
      message:
        description: 'e.g. "Hello World"'
        required: true
        type: string
      message-group-id:
        description: 'e.g. "12345" - only required for fifo queues'
        default: '"1337"'
        required: false
        type: string
      stringify-message:
        description: 'do you want to stringify the message?'
        default: 'true'
        required: false
        type: boolean

jobs:
  send-sqs-message:
    runs-on: self-hosted-runner
    steps:
      - uses: sammcj/sqs-message-action@main
        with:
          sqs-url: ${{ inputs.sqs-url }}
          message: ${{ inputs.message }}
          message-group-id: ${{ inputs.message-group-id }}
          message-attributes: ${{ inputs.message-attributes }}
          stringify-message: ${{ inputs.stringify-message }}
```

## Testing

- TODO: Add unit tests

You can use localstack to provide a local SQS queue and run the action locally.

```shell
cd localstack
./install-localstack.sh # if you don't already have localstack and awscli-local installed
./start-localstack.sh
```

This will provide you a local SQS queue such as:

```shell
http://localhost:4566/000000000000/my-test-queue.fifo
```

Then you can use act to run the action locally:

```shell
AWS_PROFILE="localstack" \
REGION="ap-southeast-2" \
SQS_URL="http://localhost:4566/000000000000/my-test-queue.fifo" \
MESSAGE='{"foo": "bar"}' \
MESSAGE_GROUP_ID="12345" \
STRINGIFY_MESSAGE="true" \
MESSAGE_ATTRIBUTES=<localstack/test-sqs-message-attributes.json \
node index.js
```

This should return output such as:

# pragma: allowlist nextline secret

```json
::set-output name=message-body::"{\"foo\": \"bar\"}"
::set-output name=queue-url::
resp {
  "ResponseMetadata": {
    "RequestId": "5NC8JASHA2O9KO1KJV45G0838D1NFAVUR2AXHV09ZTZWWH0YGAMX"
  },
  "MD5OfMessageBody": "76b92a8af5066b1851a93e7de3bf76ef",
  "MessageId": "1d5ecc91-3964-4113-9ecf-c595565df9b7",
  "SequenceNumber": "14306326717680058368"
}
```

or using act:

```shell
act workflow_dispatch -j run-tests-locally --container-architecture linux/amd64
```
