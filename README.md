# SQS Message Action

This action will publish a message to an AWS SQS queue.

## Inputs

- `sqs-url` - The URL of the SQS queue to publish to (required).
- `message` - The message to publish (required).
- `message-attributes` - The message attributes to publish in JSON (optional).

## Usage

This assumes your runner has access to the required AWS resources.

```yaml
- uses: sammcj/sqs-message-action@main
  with:
    sqs-url: https://sqs.ap-southeast-2.amazonaws.com/<path>
    message: "Hello World"
    message-attributes:
      key1:
        DataType: "String"
        StringValue: "value1"
      key2:
        DataType: "Number"
        StringValue: "6"
```
