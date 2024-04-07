import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
	name: 'profile',
	initialState: {
		name: '',
		linkedChannel: ''
	},
	reducers: {
		setProfile: (state, action) => {
			state.name = action.payload;
		},
		setLinkedChannel: (state, action) => {
			state.linkedChannel = action.payload;
		}
	}
});

export const selectProfile = (state) => state.profile;
export const { setProfile, setLinkedChannel } = profileSlice.actions;
export default profileSlice.reducer;
