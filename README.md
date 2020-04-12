# Cat Foster App

AWS Amplify URL:

https://master.d2ppwq93khmm84.amplifyapp.com/

## Summary

This application is my capstone project for the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990).

It is a basic online platform where people can register and login to give their cats up for adoption.

It is possible for multiple people to create an account and to manage their own cats that they are giving up for adoption in the foster area. Simultaneously, the public can access a collection of all cats up for adoption in the adoption area. The checkout has not yet been coded any maybe is something for future releases.

The project demonstrates the successful utilization of several key concepts / technologies, namely:

- Amazon Web Services (AWS)
  - [API Gateway (API manager)](https://aws.amazon.com/api-gateway/)
  - [CloudFormation (cloud provisioning)](https://aws.amazon.com/cloudformation/)
  - [DynamoDB (NoSQL database)](https://aws.amazon.com/dynamodb/)
  - [Identity and Access Management (IAM)](https://aws.amazon.com/iam/)
  - [Lambda (serverless functions)](https://aws.amazon.com/lambda/)
  - [S3 (item storage)](https://aws.amazon.com/s3/)
- [Serverless Framework](https://serverless.com/)
- Frontend Client
  - [AWS Amplify Client Framework](https://aws.amazon.com/amplify/)
  - [ReactJS](https://reactjs.org/)
- [Auth0](https://auth0.com/)
  - OAuth integration for authentication and authorisation
- Optimisation
  - Global Secondary Indexes on DynamoDB
  - Individual packaging of Lambdas (when enabled in serverless.yml)

## Requirements

- [AWS Account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Auth0](https://auth0.com/)
- [Node 12](https://nodejs.org/en/)
- [Serverless](https://serverless.com/framework/docs/getting-started/)

## File Overview

- **cat\-pool**
  - **client** (Frontend)
    - **public** (React files)
    - **src**
      - **api** (REST API to service)
      - **auth** (Auth0 authentication)
      - **components** (React components)
      - **types** (Typescript interfaces)
      - **utils**
  - **service** (Serverless Stack)
    - [serverless.yml](service/serverless.yml) (Serverless framework config file)
    - **src**
      - **auth** (JWT handling)
      - **lambda** (Serverless lambdas)
        - **http** (HTTP handlers)
      - **models** (Typescript interfaces)
      - **utils** (Logging)

## Installation

Use the npm package manager to install required dependencies:

```bash
cd service
npm install

cd client
npm install
```

## Usage

### Serverless Deployment

If required, uncomment option in serverless.yml to enable individual packaging of functions. To avoid possible memory requirement issues run:

```bash
export NODE_OPTIONS=--max_old_space_size=4096
```

To deploy run:

```bash
sls deploy -v
```

### Serverless CD

Setup an account on: https://dashboard.serverless.com/ and configure. After manual deployment, your application should be available for automated CD.

### Start Client Locally

Update client/src/config.ts credentials to match your credentials for Auth0 and Serverless deployment.

```bash
cd client

nodemon npm run start
```

### Client Cloud Deployment

Configure via [Amplify Console](https://aws-amplify.github.io/docs/js/react):

```
npm install -g @aws-amplify/cli
amplify configure
amplify init
amplify add hosting
amplify publish
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Screenshots

**Screenshot of CloudFormation Stack for Serverless deployment**
![Image of CloudFormation Summary](https://github.com/srlars/aws-serverless-foster-cats/tree/master/screenshots/coudformation_stack_serverless.png)

**Screenshot of Serverless deployment**
![Image of Serverless Deployment](https://github.com/srlars/aws-serverless-foster-cats/tree/master/screenshots/serverless_deployment.png)

**Screenshot of Serverless dashboard**
![Image of Serverless Dashboard](https://github.com/srlars/aws-serverless-foster-cats/tree/master/screenshots/serverless_dashboard.png)

**Screenshot of Amplify Console (The React App was deployed via AWS Amplify - static build inside S3 bucket)**
![Image of Client Amplify Deployment](https://github.com/srlars/aws-serverless-foster-cats/tree/master/screenshots/aws_amplify_client.png)
