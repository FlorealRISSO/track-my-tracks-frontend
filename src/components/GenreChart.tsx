import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from 'react-native-paper';

const GenreChart = ({ genres }) => {
  const theme = useTheme();

  // Material Design color palette from the theme
  const chartColors = ['#FF9F0A', '#FF375F', '#5E5CE6', '#FF453A', '#64D2FF'];


  const chartData = genres.map((genre, index) => ({
    name: genre.name,
    population: genre.count,
    color: chartColors[index % chartColors.length], // Rotate through Material colors
    legendFontColor: theme.colors.onSurfaceVariant, // Use a surface variant for legibility
  }));

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        Genre Distribution
      </Text>
      <PieChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Chart text color remains white
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default GenreChart;