import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Region, Marker, Callout } from 'react-native-maps';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync, Accuracy } from 'expo-location';

import Load from '../components/Load';
import api from '../services/api';
import { connect, disconnect, socket } from '../services/socket';
import DevMarker from '../components/DevMarker';
import DevProps from '../types/Dev';
import {
	AndroidNotificationPriority,
	scheduleNotificationAsync,
	setNotificationHandler
} from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';

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
	const [currentLocation, setCurrentLocation] = useState<any>({});
	const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);

	async function loadInitialPosition() {

		try {
			const { status } = await requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permissão Negada', 'Permissão para acessar a localização foi negada');
				return;
			}

			const { coords } = await getCurrentPositionAsync({
				accuracy: Accuracy.BestForNavigation
			});

			setCurrentLocation({
				latitude: coords.latitude,
				longitude: coords.longitude,
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
					techs
				}
			});

			setDevs(data);
			setLoading(false);
			setupWebSocket();
		} catch (error: any) {
			console.log(error.response);
		}
	}

	function handleRegionChange(region: Region) {
		setCurrentRegion(region);
	}

	function setupWebSocket() {
		disconnect();
		const { latitude, longitude } = currentRegion;
		connect(
			latitude.toString(),
			longitude.toString(),
			techs
		);
	}

	useEffect(() => {
		loadInitialPosition();
	}, []);

	useEffect(() => {
		socket.on('new-dev', async dev => {
			setNotificationHandler({
				handleNotification: async () => ({
					shouldShowAlert: true,
					shouldPlaySound: true,
					shouldSetBadge: true,
				}),
			});
			await scheduleNotificationAsync({
				content: {
					title: 'Novo Desenvolvedor!',
					body: `Novo Desenvolvedor perto de você`,
					sound: true,
					priority: AndroidNotificationPriority.HIGH,
				},
				trigger: {
					seconds: 1,
				}
			});
			setDevs(oldValue => [...oldValue, dev]);

		});
		socket.on('dev-deleted', dev => setDevs(oldValue => oldValue.filter(oldDev => oldDev._id != dev._id)));
		return () => {
			socket.off();
		}
	}, [devs]);

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
				<Marker coordinate={{
					longitude: currentLocation.longitude,
					latitude: currentLocation.latitude
				}}>
					<MaterialIcons name="location-pin" size={50} color="red" />
					<Callout style={styles.callout}>
						<View style={styles.callout}>
							<Text style={styles.location}>
								Você está aqui
							</Text>
						</View>
					</Callout>
				</Marker>
				{devs.map(dev => <DevMarker key={dev._id} {...dev} />)}
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
	callout: {
		width: 260,
	},
	location: {
		fontWeight: 'bold',
		fontSize: 16,
		color: "#666",
		textAlign: 'center'
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
