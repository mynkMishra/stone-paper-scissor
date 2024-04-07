import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profile.slice';
import gameLobbyReducer from './game-lobby.slice';
import gameStatusReducer from './game-channel.slice';

const store = configureStore({
	reducer: {
		profile: profileReducer,
		gameLobby: gameLobbyReducer,
		gameChannel: gameStatusReducer
	}
});

export default store;
