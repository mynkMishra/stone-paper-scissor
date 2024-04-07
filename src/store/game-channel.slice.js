import { createSlice } from '@reduxjs/toolkit';
import { CURRENT_TURN, GAME_STATUS } from '../utils/constant';

const initialState = {
	channelName: '',
	isGameVisible: false,
	status: GAME_STATUS.WAITING,
	playerOne: '',
	playerTwo: '',
	playerOneOption: '',
	playerTwoOption: '',
	currentTurn: CURRENT_TURN.PLAYER_ONE
};

const gameChannelSlice = createSlice({
	name: 'game-channel',
	initialState,
	reducers: {
		setGameChannel: (state, action) => action.payload,
		resetGameChannel: (state) => ({ ...initialState })
	}
});

export const selectGameChannel = (state) => state.gameChannel;
export const { setGameChannel, resetGameChannel } = gameChannelSlice.actions;
export default gameChannelSlice.reducer;
