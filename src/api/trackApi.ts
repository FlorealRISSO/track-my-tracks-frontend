import { API_URL } from './server';

export const noData = {
  timeListened: "0h 0m", // Increased total time listened
  songCount: 0, // More songs listened to
  genres: [],
  topArtists: [],
  topTracks: []
};

export const fetchDailySummary = async (day: string) => {
  try {
    const response = await fetch(`${API_URL}/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ day }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return noData;
  }
};