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
```
