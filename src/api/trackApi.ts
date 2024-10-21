import { API_URL } from './server';

// This is a mock API. In a real application, you would replace these
// functions with actual API calls to your backend.

export const fetchDashboardData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    timeListened: "12h 45m", // Increased total time listened
    songCount: 156, // More songs listened to
    genres: [
      { name: "Pop", count: 54 },
      { name: "Rock", count: 38 },
      { name: "Hip Hop", count: 28 },
      { name: "Electronic", count: 20 },
      { name: "R&B", count: 16 },
      { name: "Jazz", count: 10 },
      { name: "Classical", count: 6 },
      { name: "Reggae", count: 4 },
      { name: "Other", count: 2 },
    ],
    topArtists: [
      { id: "1", name: "Dua Lipa", playCount: 42 },
      { id: "2", name: "The Weeknd", playCount: 36 },
      { id: "3", name: "Billie Eilish", playCount: 29 },
      { id: "4", name: "Drake", playCount: 27 },
      { id: "5", name: "Ed Sheeran", playCount: 25 },
      { id: "6", name: "Post Malone", playCount: 24 },
      { id: "7", name: "Tones and I", playCount: 20 },
      { id: "8", name: "Imagine Dragons", playCount: 18 },
    ],
  };
};

export const noData = {
  timeListened: "0h 0m", // Increased total time listened
  songCount: 0, // More songs listened to
  genres: [],
  topArtists: [],
  topTracks: []
};

export const fetchDailySummary = async (key: string, day: string) => {
  console.log(`Fetching daily summary for day: ${day}`);

  try {
    const response = await fetch(`${API_URL}/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, day }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Daily summary:', data);

    let d2 = await fetchDashboardData();
    console.log('Dashboard data:', d2);

    return data;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    throw error;
  }
};

export const fetchSongList = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    { id: "1", title: "Levitating", artist: "Dua Lipa", duration: "3:23" },
    { id: "2", title: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
    { id: "3", title: "Bad Guy", artist: "Billie Eilish", duration: "3:14" },
    { id: "4", title: "God's Plan", artist: "Drake", duration: "3:19" },
    { id: "5", title: "Shape of You", artist: "Ed Sheeran", duration: "3:53" },
    { id: "6", title: "Circles", artist: "Post Malone", duration: "3:35" },
    { id: "7", title: "Dance Monkey", artist: "Tones and I", duration: "3:29" },
    { id: "8", title: "Believer", artist: "Imagine Dragons", duration: "3:24" },
    { id: "9", title: "Peaches", artist: "Justin Bieber", duration: "3:18" },
    { id: "10", title: "Stay", artist: "The Kid LAROI & Justin Bieber", duration: "2:21" },
  ];
};
