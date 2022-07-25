# SQS Message Action

This action will publish a message to an AWS SQS queue.

## Inputs

- `sqs-url` - The URL of the SQS queue to publish to (required).
- `message` - The message to publish (required).
- `message-group-id` - The message group ID to publish to (optional).
- `message-attributes` - A map of message attributes to publish (optional).

## Usage

This assumes your runner has access to the required AWS resources.

```yaml
- uses: sammcj/sqs-message-action@main
  with:
    sqs-url: https://sqs.ap-southeast-2.amazonaws.com/<account-id>/<queue-name>
    message: "Hello World"
    message-group-id: "12345"
    message-attributes:
      key1:
       stringValue: "value1"
       dataType: "String"
      key2:
       stringValue: "value2"
       dataType: "String"
```
