import React from 'react';
import { useRoute } from '@react-navigation/core';
import { WebView } from 'react-native-webview';
import { ProfileScreenRouteProp } from '../types/Navigation';

export default function Profile() {
	const route = useRoute<ProfileScreenRouteProp>();

	const { github_username } = route.params;

	return (
		<WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${github_username}` }} />
	);
}
