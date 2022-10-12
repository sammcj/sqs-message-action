#!/usr/bin/env bash
set -euo pipefail

# enable debug
# set -x

echo "starting localstack"
docker compose up -d

LOCALSTACK_HOST="localhost"
AWS_REGION="ap-southeast-2"
PROJECT_NAME="sqs-message-action"

create_secret_manager() {
  local SECRET_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 secretsmanager create-secret --name "${SECRET_NAME_TO_CREATE}" --region ${AWS_REGION} --secret-string "{\"hostname\":\"docker.for.mac.localhost\",\"password\":\"password\",\"username\":\"user\",\"port\":\"2222\"}"
}

create_queue() {
  local QUEUE_NAME_TO_CREATE=$1
  local REDRIVE_POLICY="'{\"deadLetterTargetArn\":\"arn:aws:sqs:${AWS_REGION}:000000000000:${QUEUE_NAME_TO_CREATE}-dlq.fifo\",\"maxReceiveCount\":\"3\"}'"
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name "${QUEUE_NAME_TO_CREATE}"-dlq.fifo --region ${AWS_REGION} --attributes FifoQueue=true,ContentBasedDeduplication=true
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name "${QUEUE_NAME_TO_CREATE}".fifo --region ${AWS_REGION} --attributes FifoQueue=true,ContentBasedDeduplication=true,RedrivePolicy="${REDRIVE_POLICY}"
}

create_bucket() {
  # Create S3 Bucket
  awslocal s3 mb s3://"${1}"
}

echo ""
echo "[$PROJECT_NAME] configuring sqs"
echo "==================="

# Create Queues
create_queue "my-test-queue"

# List All Queues
echo ""
echo "Available Queues are"
echo "==================="
awslocal sqs list-queues
