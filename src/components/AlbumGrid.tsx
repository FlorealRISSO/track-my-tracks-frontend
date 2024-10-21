import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

const AlbumItem = ({ album, theme }) => (
  <View style={[styles.albumItem, { backgroundColor: theme.colors.surface }]}>
    <Image source={{ uri: album.coverUrl }} style={styles.albumCover} />
    <Text style={[styles.albumName, { color: theme.colors.onSurface }]} numberOfLines={2}>{album.name}</Text>
    <Text style={[styles.albumArtist, { color: theme.colors.onSurface }]} numberOfLines={1}>{album.artist}</Text>
  </View>
);

const AlbumGrid = ({ albums }) => {
  const theme = useTheme();
    return(
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Top Albums</Text>
        <FlatList
          data={albums}
          renderItem={({ item }) => <AlbumItem album={item} theme={theme} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  albumItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    elevation: 2, // Add shadow for Android
  },
  albumCover: {
    width: '100%', // Make cover responsive
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  albumName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 12,
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default AlbumGrid;
