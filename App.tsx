import * as React from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

console.log('redirectUri', redirectUri)

export default function Auth() {
  const discovery = AuthSession.useAutoDiscovery('https://nci2y1.logto.app/oidc');
 
	// Create and load an auth request
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
			usePKCE: true,
			codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      clientId: 'wee3ntpyuq5nq7tsmts8g',
      redirectUri,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
    },
    discovery
  );

	console.log('result', result);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login!" disabled={!request} onPress={() => promptAsync()} />
      {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
    </View>
  );
}
