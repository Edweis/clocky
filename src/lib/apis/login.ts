import ky from 'ky';
import localforage from 'localforage';
import {
  AssumeRoleWithWebIdentityCommand,
  STSClient,
} from '@aws-sdk/client-sts';
import type { Credentials } from '@aws-sdk/types';
import { ACCOUNT_ID, AMZ_KEY, REGION } from './constants';

const LF_IDENTITY_ID = 'identity-id';

const IDP_ID = 'ap-southeast-1:36e5c7ea-5475-4893-bf37-8fa8f7169388';
const AMZ_TARGETS = {
  GetOpenIdToken: 'AWSCognitoIdentityService.GetOpenIdToken',
  GetId: 'AWSCognitoIdentityService.GetId',
  GetCredentialsForIdentity:
    'AWSCognitoIdentityService.GetCredentialsForIdentity',
};
const UNAUTH_ROLE_NAME = 'Cognito_Clocky_S3_access_unauth';
const UNAUTH_ROLE_ID = 'AROAWNUSTGS2E5ZUU5K7O'; // via: AWS_PROFILE=kapochamo aws iam get-role --role-name Cognito_Clocky_S3_access_unauth
const cognito = ky.create({
  prefixUrl: `https://cognito-identity.${REGION}.amazonaws.com`,
  headers: { 'Content-Type': 'application/x-amz-json-1.1' },
});
const getIdentityId = async () => {
  const currentIdentityId = await localforage.getItem<string>(LF_IDENTITY_ID);
  if (currentIdentityId) return currentIdentityId;
  const response = await cognito
    .post('', {
      json: { AccountId: ACCOUNT_ID, IdentityPoolId: IDP_ID },
      headers: { [AMZ_KEY]: AMZ_TARGETS.GetId },
    })
    .json<{ IdentityId: string }>();
  console.log(response);
  const identityId = response.IdentityId;
  await localforage.setItem(LF_IDENTITY_ID, identityId);
  return identityId;
};

const getOpenIdToken = async (identityId: string) => {
  const response = await cognito
    .post('', {
      json: { IdentityId: identityId },
      headers: { [AMZ_KEY]: AMZ_TARGETS.GetOpenIdToken },
    })
    .json<{ Token: string }>();
  return response.Token;
};

const getCredentialsForIdentity = async (
  openIdToken: string,
  roleName: string,
) => {
  const response = await new STSClient({ region: REGION }).send(
    new AssumeRoleWithWebIdentityCommand({
      RoleArn: `arn:aws:iam::${ACCOUNT_ID}:role/${UNAUTH_ROLE_NAME}`,
      RoleSessionName: roleName,
      DurationSeconds: 3600,
      WebIdentityToken: openIdToken,
    }),
  );
  if (response.Credentials == null)
    throw Error('Credentials returned is undefined');
  return response.Credentials;
};

export const login = async () => {
  // doc: https://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
  // we use "basic authflow" in order to be able to set the `RoleSessionName` in the STS credentials.
  // Having the role session name allow us to have an IAM policy tighed to the identityId hence restricting properly s3 operations
  const identityId = await getIdentityId(); // like ap-southeast-1:620d6ff0-f663-4615-a951-5eab139d3885
  const roleName = identityId.split(':')[1];
  const openIdToken = await getOpenIdToken(identityId);
  const stsCredentials = await getCredentialsForIdentity(openIdToken, roleName);
  const credentials: Credentials = {
    accessKeyId: stsCredentials.AccessKeyId as string,
    secretAccessKey: stsCredentials.SecretAccessKey as string,
    expiration: stsCredentials.Expiration,
    sessionToken: stsCredentials.SessionToken,
  };
  const awsUserId = `${UNAUTH_ROLE_ID}:${roleName}`; // `aws:userid` used in IAM, doc:https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_variables.html
  console.log({ identityId, openIdToken, credentials });
  return { awsUserId, credentials };
};
