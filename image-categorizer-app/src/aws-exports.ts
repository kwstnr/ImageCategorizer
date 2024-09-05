import { ResourcesConfig } from 'aws-amplify';

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_8ErpaXsQ2',
      userPoolClientId: 'm6h1tg0do4jraifc945nfuihe',
    },
  },
};

export default awsConfig;
