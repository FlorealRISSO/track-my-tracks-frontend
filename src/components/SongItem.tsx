import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

const SongItem = ({ song }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.songInfo}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{song.title}</Text>
          <Text style={[styles.artist, { color: theme.colors.onSurface }]}>{song.artist}</Text>
        </View>
        <Text style={[styles.duration, { color: theme.colors.onSurface }]}>{song.duration}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 2, // Material Design elevation
  },
  songInfo: {
    flex: 1,
    marginBottom: 5, // Spacing between song info and duration
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
  },
  duration: {
    fontSize: 14,
    textAlign: 'right', // Align duration to the right
  },
});

export default SongItem;
