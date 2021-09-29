import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync, Accuracy } from 'expo-location';
import { RectButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import Load from '../components/Load';
import api from '../services/api';
import DevMarker from '../components/DevMarker';
import DevProps from '../types/Dev';

export default function Main() {

	const initialRegion = {
		latitude: 0,
		longitude: 0,
		latitudeDelta: 100,
		longitudeDelta: 100,
	}

	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const [techs, setTechs] = useState('');

	const [devs, setDevs] = useState<DevProps[]>([]);
	const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);

	const [errorMsg, setErrorMsg] = useState('');

	async function loadInitialPosition() {

		try {
			const { status } = await requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			const { coords } = await getCurrentPositionAsync({
				accuracy: Accuracy.Highest
			});

			setCurrentRegion({
				latitude: coords.latitude,
				longitude: coords.longitude,
				latitudeDelta: 0.04,
				longitudeDelta: 0.04,
			});
			setLoaded(true);
		} catch (error: any) {
			console.log(error.response);
		}
	}

	async function loadDevs() {
		try {
			if (loading) {
				return;
			}
			setLoading(true);
			const { latitude, longitude } = currentRegion;
			const { data } = await api.get('/devs/search', {
				params: {
					latitude,
					longitude,
					techs: techs.split(',').map(tech => tech.trim())
				}
			});
			setDevs(data);
			setLoading(false);
		} catch (error: any) {
			console.log(error.response);
		}
	}

	function handleRegionChange(region: Region) {
		setCurrentRegion(region);
	}

	useEffect(() => {
		loadInitialPosition();
	}, []);

	if (!loaded) {
		return <Load />;
	}

	return (
		<>
			<MapView
				style={styles.map}
				initialRegion={currentRegion}
				onRegionChange={handleRegionChange}
			>
				{devs.map(dev => <DevMarker {...dev} key={`${dev.github_username}`} />)}
			</MapView>
			<View style={styles.searchForm}>
				<TextInput
					style={styles.searchInput}
					value={techs}
					onChangeText={text => setTechs(text)}
					placeholder="Buscar devs por tecnologias..."
					placeholderTextColor="#9099"
					autoCapitalize="words"
					autoCorrect={false}
				/>
				<RectButton style={styles.loadButton} onPress={loadDevs}>
					{loading ? <ActivityIndicator size={20} color="#FFF" /> : <MaterialIcons name="my-location" size={20} color="#FFF" />}
				</RectButton>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 4,
		borderWidth: 4,
		borderColor: '#FFF',
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
	},
	searchForm: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		right: 20,
		zIndex: 5,
		flexDirection: 'row'
	},
	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: '#FFF',
		color: '#333',
		borderRadius: 25,
		paddingHorizontal: 20,
		fontSize: 16,
		elevation: 2
	},
	loadButton: {
		width: 50,
		height: 50,
		backgroundColor: '#8E4DFF',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 25,
		marginLeft: 15
	}
});
