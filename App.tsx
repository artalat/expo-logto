import * as React from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

const CLIENT_ID = 'wee3ntpyuq5nq7tsmts8g';
const SCOPES = ['openid', 'profile', 'email', 'offline_access'];

export default function Auth() {
  const [token, setToken] = React.useState<any>();
  const discovery = AuthSession.useAutoDiscovery('https://nci2y1.logto.app/oidc');
 
	// Create and load an auth request
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
			usePKCE: true,
			codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      clientId: CLIENT_ID,
      redirectUri,
      scopes: SCOPES,
    },
    discovery
  );

  const handleResponse = React.useCallback(
    async () => {

      if (result?.type !== 'success' || result.params.error) {
        console.log('Something went wrong');
        return;
      }

      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          scopes: SCOPES,
          code: result.params.code,
          clientId: CLIENT_ID,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier ? request.codeVerifier : ''
          }
        },
        discovery as any
      );

      setToken(JSON.parse(JSON.stringify(tokenResult)));
    },
    [request, result, discovery]
  );



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>AuthSession Example</Text>
      <Text>Redirect URI: {redirectUri}</Text>
      <Text>Client ID: {CLIENT_ID}</Text>
      <Text>Scopes: {SCOPES.join(', ')}</Text>
      <View style={{ height: 20 }} />
      <Button title="Login!" disabled={!request} onPress={() => promptAsync()} />
      {result && <Text style={{width: '90%'}}>{JSON.stringify(result, null, 2)}</Text>}
      <Button title="Get Token" disabled={result?.type !== 'success'} onPress={() => handleResponse()} />
      {token && <Text style={{width: '90%'}}>{JSON.stringify(token, null, 2)}</Text>}
    </View>
  );
}
