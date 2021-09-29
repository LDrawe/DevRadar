import React from 'react';
import { useRoute } from '@react-navigation/core';
import { WebView } from 'react-native-webview';

export default function Profile() {
    const route = useRoute();
    // const { github_username } = route.params;
    return (
        <WebView style={{ flex: 1 }} source={{ uri: 'https://github.com/LDrawe' }} />
    );
}
