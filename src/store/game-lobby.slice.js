import { createSlice } from '@reduxjs/toolkit';

const gameLobbySlice = createSlice({
	name: 'game-lobby',
	initialState: {
		entries: [], // {player: '', channel: ''}
		leaderboard: [] // {player: '', score: ''}
	},
	reducers: {
		setGameLobbyEntries: (state, action) => {
			state.entries = action.payload;
		},
		addEntry: (state, action) => {
			state.entries = [...state.entries, action.payload];
		},
		removeEntry: (state, action) => {
			state.entries = state.entries.filter((el) => el !== action.payload);
		},
		setLeaderBoard: (state, action) => {
			state.leaderboard = action.payload;
		}
	}
});

export const selectGameLobby = (state) => state.gameLobby;
export const { setGameLobbyEntries, setLeaderBoard, addEntry, removeEntry } =
	gameLobbySlice.actions;
export default gameLobbySlice.reducer;
