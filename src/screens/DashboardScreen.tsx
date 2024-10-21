import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useTheme, Appbar, Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchDailySummary, noData } from '../api/trackApi';
import SummaryCard from '../components/SummaryCard';
import GenreChart from '../components/GenreChart';
import SortedList from '../components/ArtistList';
import { formatDate } from '../utils/date';

const cashedData = new Map<string, any>();

const DashboardScreen = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const theme = useTheme();
    const navigation = useNavigation();
    const key = localStorage.getItem('key');

    useEffect(() => {
        const today = new Date();
        if (currentDate > today) {
            setDashboardData(noData)
            return;
        }

        const loadDashboardData = async () => {
            const day = formatDate(currentDate);
            const data = cashedData.get(day) || await fetchDailySummary(key, day);
            cashedData.set(day, data);
            setDashboardData(data);
        };
        loadDashboardData();
    }, [currentDate]);

    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
    };

    if (!dashboardData) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Appbar.Header>
                    <Appbar.Action icon="arrow-left" onPress={navigation.goBack} />
                    <Appbar.Content title="Dashboard" />
                </Appbar.Header>
                <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ color: theme.colors.onBackground }}>Loading...</Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.Action icon="arrow-left" onPress={navigation.goBack} />
                <Appbar.Content title="Dashboard" />
            </Appbar.Header>

            <View style={styles.dateNavigation}>
                <Button onPress={() => changeDate(-1)} icon={() => <ChevronLeft color={theme.colors.primary} />} children={''} />
                <Text style={[styles.dateText, { color: theme.colors.onBackground }]}>
                    {currentDate.toDateString()}
                </Text>
                <Button onPress={() => changeDate(1)} icon={() => <ChevronRight color={theme.colors.primary} />} children={''} />
            </View>

            <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.content}>
                    <SummaryCard
                        timeListened={dashboardData.timeListened}
                        songCount={dashboardData.songCount}
                    />
                    <Card style={styles.card}>
                        <Card.Content>
                            <GenreChart genres={dashboardData.genres} />
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content>
                            <SortedList elements={dashboardData.topArtists} title='Top Artists' />
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content>
                            <SortedList elements={dashboardData.topTracks} title='Top Tracks' />
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewAllButton: {
        margin: 20,
    },
});

export default DashboardScreen;