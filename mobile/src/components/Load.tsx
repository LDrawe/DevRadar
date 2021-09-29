import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import MapAnimation from '../animations/map-location.json';

const Load = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={MapAnimation}
                autoPlay
                loop
            />
        </View>
    );
}

export default Load;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
