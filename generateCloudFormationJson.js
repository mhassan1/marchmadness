/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const assert = require('assert')
const { writeFileSync } = require('fs')

const bucket = process.argv[2]
assert(bucket)

const stage = process.argv[3]
assert(stage)

const timestamp = process.argv[4]
assert(timestamp)

writeFileSync(
  'cloudformation.json',
  JSON.stringify(
    {
      AWSTemplateFormatVersion: '2010-09-09',
      Description: 'The AWS CloudFormation template for this application',
      Resources: {
        MarchmadnessLogGroup: {
          Type: 'AWS::Logs::LogGroup',
          Properties: {
            LogGroupName: `/aws/lambda/marchmadness-${stage}`,
          },
        },
        IamRoleLambdaExecution: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: {
                    Service: ['lambda.amazonaws.com'],
                  },
                  Action: ['sts:AssumeRole'],
                },
              ],
            },
            Policies: [
              {
                PolicyName: `marchmadness-${stage}-lambda`,
                PolicyDocument: {
                  Version: '2012-10-17',
                  Statement: [
                    {
                      Effect: 'Allow',
                      Action: [
                        'logs:CreateLogStream',
                        'logs:CreateLogGroup',
                        'logs:TagResource',
                      ],
                      Resource: [
                        {
                          'Fn::Sub': `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/marchmadness-${stage}*:*`,
                        },
                      ],
                    },
                    {
                      Effect: 'Allow',
                      Action: ['logs:PutLogEvents'],
                      Resource: [
                        {
                          'Fn::Sub': `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/marchmadness-${stage}*:*:*`,
                        },
                      ],
                    },
                    {
                      Effect: 'Allow',
                      Action: [
                        'dynamodb:Query',
                        'dynamodb:Scan',
                        'dynamodb:GetItem',
                        'dynamodb:PutItem',
                        'dynamodb:UpdateItem',
                        'dynamodb:BatchWriteItem',
                        'dynamodb:DeleteItem',
                        'dynamodb:DescribeTable',
                      ],
                      Resource: [
                        {
                          'Fn::GetAtt': ['sessionsTable', 'Arn'],
                        },
                        {
                          'Fn::GetAtt': ['mappingsTable', 'Arn'],
                        },
                        {
                          'Fn::GetAtt': ['usersTable', 'Arn'],
                        },
                        {
                          'Fn::GetAtt': ['oddsTable', 'Arn'],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
            Path: '/',
            RoleName: {
              'Fn::Join': [
                '-',
                [
                  'marchmadness',
                  stage,
                  {
                    Ref: 'AWS::Region',
                  },
                  'lambdaRole',
                ],
              ],
            },
          },
        },
        MarchmadnessLambdaFunction: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: bucket,
              S3Key: `${stage}/${timestamp}/marchmadness.zip`,
            },
            Handler: 'lambda.handler',
            Runtime: 'nodejs20.x',
            FunctionName: `marchmadness-${stage}`,
            MemorySize: 512,
            Timeout: 10,
            Environment: {
              Variables: {
                STAGE: stage,
                SESSION_SECRET: process.env.SESSION_SECRET,
              },
            },
            Role: {
              'Fn::GetAtt': ['IamRoleLambdaExecution', 'Arn'],
            },
          },
          DependsOn: ['MarchmadnessLogGroup'],
        },
        MarchmadnessEventsRuleSchedule1: {
          Type: 'AWS::Events::Rule',
          Properties: {
            ScheduleExpression: 'rate(15 minutes)',
            State: 'ENABLED',
            Targets: [
              {
                Arn: {
                  'Fn::GetAtt': ['MarchmadnessLambdaFunction', 'Arn'],
                },
                Id: 'marchmadnessSchedule',
              },
            ],
          },
        },
        MarchmadnessLambdaPermissionEventsRuleSchedule1: {
          Type: 'AWS::Lambda::Permission',
          Properties: {
            FunctionName: {
              'Fn::GetAtt': ['MarchmadnessLambdaFunction', 'Arn'],
            },
            Action: 'lambda:InvokeFunction',
            Principal: 'events.amazonaws.com',
            SourceArn: {
              'Fn::GetAtt': ['MarchmadnessEventsRuleSchedule1', 'Arn'],
            },
          },
        },
        HttpApi: {
          Type: 'AWS::ApiGatewayV2::Api',
          Properties: {
            Name: `marchmadness-${stage}`,
            ProtocolType: 'HTTP',
          },
        },
        HttpApiStage: {
          Type: 'AWS::ApiGatewayV2::Stage',
          Properties: {
            ApiId: {
              Ref: 'HttpApi',
            },
            StageName: '$default',
            AutoDeploy: true,
            DefaultRouteSettings: {
              DetailedMetricsEnabled: false,
            },
          },
        },
        MarchmadnessLambdaPermissionHttpApi: {
          Type: 'AWS::Lambda::Permission',
          Properties: {
            FunctionName: {
              'Fn::GetAtt': ['MarchmadnessLambdaFunction', 'Arn'],
            },
            Action: 'lambda:InvokeFunction',
            Principal: 'apigateway.amazonaws.com',
            SourceArn: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':execute-api:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':',
                  {
                    Ref: 'HttpApi',
                  },
                  '/*',
                ],
              ],
            },
          },
        },
        HttpApiIntegrationMarchmadness: {
          Type: 'AWS::ApiGatewayV2::Integration',
          Properties: {
            ApiId: {
              Ref: 'HttpApi',
            },
            IntegrationType: 'AWS_PROXY',
            IntegrationUri: {
              'Fn::GetAtt': ['MarchmadnessLambdaFunction', 'Arn'],
            },
            PayloadFormatVersion: '2.0',
            TimeoutInMillis: 30000,
          },
        },
        HttpApiRouteDefault: {
          Type: 'AWS::ApiGatewayV2::Route',
          Properties: {
            ApiId: {
              Ref: 'HttpApi',
            },
            RouteKey: '$default',
            Target: {
              'Fn::Join': [
                '/',
                [
                  'integrations',
                  {
                    Ref: 'HttpApiIntegrationMarchmadness',
                  },
                ],
              ],
            },
          },
          DependsOn: 'HttpApiIntegrationMarchmadness',
        },
        sessionsTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
            TableName: `madness_sessions_${stage}`,
            AttributeDefinitions: [
              {
                AttributeName: 'id',
                AttributeType: 'S',
              },
            ],
            KeySchema: [
              {
                AttributeName: 'id',
                KeyType: 'HASH',
              },
            ],
            BillingMode: 'PAY_PER_REQUEST',
          },
        },
        mappingsTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
            TableName: `madness_bracket_mappings_${stage}`,
            AttributeDefinitions: [
              {
                AttributeName: 'bracket_id',
                AttributeType: 'N',
              },
            ],
            KeySchema: [
              {
                AttributeName: 'bracket_id',
                KeyType: 'HASH',
              },
            ],
            BillingMode: 'PAY_PER_REQUEST',
          },
        },
        usersTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
            TableName: `madness_users_${stage}`,
            AttributeDefinitions: [
              {
                AttributeName: 'username',
                AttributeType: 'S',
              },
            ],
            KeySchema: [
              {
                AttributeName: 'username',
                KeyType: 'HASH',
              },
            ],
            BillingMode: 'PAY_PER_REQUEST',
          },
        },
        oddsTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
            TableName: `madness_odds_${stage}`,
            AttributeDefinitions: [
              {
                AttributeName: 'source',
                AttributeType: 'S',
              },
            ],
            KeySchema: [
              {
                AttributeName: 'source',
                KeyType: 'HASH',
              },
            ],
            BillingMode: 'PAY_PER_REQUEST',
          },
        },
      },
      Outputs: {
        HttpApiUrl: {
          Description: 'URL of the HTTP API',
          Value: {
            'Fn::Join': [
              '',
              [
                'https://',
                {
                  Ref: 'HttpApi',
                },
                '.execute-api.',
                {
                  Ref: 'AWS::Region',
                },
                '.',
                {
                  Ref: 'AWS::URLSuffix',
                },
              ],
            ],
          },
          Export: {
            Name: `marchmadness-${stage}-HttpApiUrl`,
          },
        },
      },
    },
    null,
    2,
  ),
)
