import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Marker, Callout } from 'react-native-maps';
import { StackParamsProps } from '../types/Navigation';
import DevProps from '../types/Dev';

export default function DevMarker(dev: DevProps) {

    const navigation = useNavigation<StackNavigationProp<StackParamsProps>>();

    return (
        <Marker coordinate={{
            longitude: dev.location.coordinates[0],
            latitude: dev.location.coordinates[1]
        }}>
            <Image source={{ uri: dev.avatar_url }} style={styles.avatar} />
            <Callout onPress={() => navigation.navigate('Profile', { github_username: dev.github_username })}>
                <View style={styles.callout}>
                    <Text style={styles.devName}>
                        {dev.name || dev.github_username}
                    </Text>
                    <Text style={styles.devBio}>
                        {dev.bio || 'Este Desenvolvedor ainda não possui uma biografia'}
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
    }
});