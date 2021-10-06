import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Marker, Callout } from 'react-native-maps';
import { StackParamsProps } from '../types/Navigation';
import DevProps from '../types/Dev';
import axios from 'axios';

export default function DevMarker(dev: DevProps) {

	const navigation = useNavigation<StackNavigationProp<StackParamsProps>>();

	const [github, setGithub] = useState({
		name: '',
		bio: '',
		avatar_url: 'https://i.stack.imgur.com/ATB3o.gif'
	});

	async function loadGitHubInfo() {
		try {
			const response = await axios.get(`https://api.github.com/users/${dev.github_username}`);
			setGithub({
				name: response.data.name,
				bio: response.data.bio,
				avatar_url: response.data.avatar_url
			});
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		loadGitHubInfo();
	}, [dev]);

	return (
		<Marker coordinate={{
			longitude: dev.location.coordinates[0],
			latitude: dev.location.coordinates[1]
		}}
		>
			<Image source={{ uri: github.avatar_url }} style={styles.avatar} />
			<Callout onPress={() => navigation.navigate('Profile', { github_username: dev.github_username })}>
				<View style={styles.callout}>
					<Text style={styles.devName}>
						{dev.name || dev.github_username}
					</Text>
					<Text style={styles.devBio}>
						{github.bio || 'Este Desenvolvedor ainda não possui uma biografia'}
					</Text>
					<Text style={styles.devTechs}>
						{dev.techs.join(', ')}
					</Text>
				</View>
			</Callout>
		</Marker>
	);
}

const styles = StyleSheet.create({
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 4,
		borderWidth: 4,
		borderColor: '#d9d9d9'
	},
	callout: {
		width: 260,
	},
	devName: {
		fontWeight: 'bold',
		fontSize: 16
	},
	devBio: {
		color: '#666',
		marginTop: 5
	},
	devTechs: {
		marginTop: 5
	}
});