import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Card } from 'react-native-paper';

const SummaryCard = ({ timeListened, songCount }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card]}>
      <Card.Content>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Daily Summary</Text>
        <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
          Time Listened: {timeListened}
        </Text>
        <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
          Songs Played: {songCount}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4, // Material Design elevation for shadow effect
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