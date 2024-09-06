import { Amplify, ResourcesConfig } from 'aws-amplify';

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_8ErpaXsQ2',
      userPoolClientId: '31gd52nq0em5tk38v49dgd4f39',
      userAttributes: {
        email: {
          required: true,
        },
      },
    },
  },
};

Amplify.configure(awsConfig);

export default awsConfig;
