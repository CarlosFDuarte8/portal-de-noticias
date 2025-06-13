import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetInfo } from '../../hooks/useNetInfo';

export const ConnectivityStatus = memo(() => {
  const { isConnected } = useNetInfo();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Você está offline - Exibindo notícias em cache</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    padding: 10,
    width: '100%',
  },
  text: {
    color: '#721c24',
    textAlign: 'center',
    fontSize: 14,
  },
});
