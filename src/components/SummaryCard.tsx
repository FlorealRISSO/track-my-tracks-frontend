import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

const SummaryCard = ({ timeListened, songCount }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>Daily Summary</Text>
      <View style={styles.element}>
        <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
          Time Listened: {timeListened}
        </Text>
        <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
          Songs Played: {songCount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  element: {
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SummaryCard;