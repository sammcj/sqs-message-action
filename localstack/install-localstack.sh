#!/usr/bin/env bash

brew install localstack
pip install -U awscli-local

echo "you must configure a profile for localstack, you can use any access key id and secret access key value"
aws configure --profile localstack
