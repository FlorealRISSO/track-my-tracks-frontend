import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from 'react-native-paper';

const chartColors = ['#FF9F0A', '#FF375F', '#5E5CE6', '#FF453A', '#64D2FF', '#50E3C2', '#FFD60A'];

const LegendItem = ({ color, label }) => {
  const theme = useTheme();

  return <View style={styles.legendItem}>
    <View style={[styles.legendCircle, { backgroundColor: color }]} />
    <Text style={[styles.legendText, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
  </View>
}

const Legend = ({ data }) => {
  return (
    <View>
      {data.map((item, index) => (
        <LegendItem key={index} color={item.color} label={item.name} />
      ))}
    </View>
  );
}

const GenreChart = ({ genres }) => {
  const theme = useTheme();

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
      <View style={styles.centeredView}>
        <PieChart
          data={chartData}
          width={200}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Chart text color remains white
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="50"
          hasLegend={false}
        />
        <Legend data={chartData} />
      </View>
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
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10, // Optional: Add rounded corners for better visual appearance
  },
});

export default GenreChart;