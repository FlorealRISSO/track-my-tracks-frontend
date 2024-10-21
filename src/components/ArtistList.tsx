import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

const SortedItem = ({ elem: elem, index }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.artistItem, { backgroundColor: theme.colors.surface}]}>
      <Card.Content>
        <Text style={[styles.artistName, { color: theme.colors.onSurface }]}>
          {index + 1}. {elem.name}
        </Text>
        <Text style={[styles.artistPlays, { color: theme.colors.onSurface }]}>
          {elem.count} plays
        </Text>
      </Card.Content>
    </Card>
  );
};

const SortedList = ({ elements: elements, title: title }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>{title}</Text>
      <FlatList
        data={elements}
        renderItem={({ item, index }) => <SortedItem elem={item} index={index} />}
        keyExtractor={(item) => item.id.toString()} // Ensure key is a string
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistItem: {
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2, // Add elevation for shadow effect
  },
  artistName: {
    fontSize: 16,
  },
  artistPlays: {
    fontSize: 14,
  },
});

export default SortedList;