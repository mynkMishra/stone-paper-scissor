import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './board.css';
import {
	LS_GAME_LOBBY,
	SS_PROFILE,
	VALID_USERNAME_LENGTH
} from '../utils/constant';
import GameArea from './game-area/game-area';
import GameLobby from './game-lobby/game-lobby';
import { selectProfile, setProfile } from '../store/profile.slice';
import {
	selectGameLobby,
	setGameLobbyEntries
} from '../store/game-lobby.slice';
import { selectGameChannel, setGameChannel } from '../store/game-channel.slice';
import LocalStorageService from '../utils/local-storage.service';
import SessionStorageService from '../utils/session-storage.service';
import LeaderBoard from './leaderboard/leaderboard';

function Board() {
	const dispatch = useDispatch();
	const profile = useSelector(selectProfile);
	const gameLobby = useSelector(selectGameLobby);
	const gameChannel = useSelector(selectGameChannel);
	const [username, setUsername] = useState('');

	useEffect(() => {
		window.onbeforeunload = function () {
			const entry = gameLobby.entries.find((el) => el.player === profile.name);
			if (entry) {
				LocalStorageService.remove(entry.channel);
				const updatedLobby = gameLobby.entries.map((el) => {
					if (el.channel === entry.channel) {
						return { ...el, channel: '' };
					}
					return el;
				});

				dispatch(setGameLobbyEntries(updatedLobby));
				LocalStorageService.set(LS_GAME_LOBBY, updatedLobby);
			}
		};
	}, []);

	useEffect(() => {
		const profileVal = SessionStorageService.get(SS_PROFILE);
		if (profileVal) {
			dispatch(setProfile(profileVal.name));
		}
	}, []);

	useEffect(() => {
		window.addEventListener('storage', (e) => {
			if (e.key === LS_GAME_LOBBY) {
				const lobby = JSON.parse(e.newValue);
				dispatch(setGameLobbyEntries(lobby));
			}
		});
	}, []);

	useEffect(() => {
		if (gameLobby.entries.length) {
			const player = gameLobby.entries.find((el) => el.player === profile.name);
			if (player && player.channel) {
				const channel = LocalStorageService.get(player.channel);
				dispatch(setGameChannel(channel));
			}
		}
	}, [gameLobby.entries]);

	useEffect(() => {
		const gameLobbyVal = LocalStorageService.get(LS_GAME_LOBBY);
		const profileVal = SessionStorageService.get(SS_PROFILE);

		if (gameLobbyVal) {
			dispatch(setGameLobbyEntries(gameLobbyVal));
		}
		if (profileVal) {
			dispatch(setProfile(profileVal.name));
		}
	}, []);

	const addUsername = function () {
		const name = username;
		const nameExistsInLobby =
			gameLobby.entries.findIndex((el) => el.player === name) !== -1;
		if (!nameExistsInLobby) {
			setUsername('');
			dispatch(
				setGameLobbyEntries([...gameLobby.entries, { player: name, channel: '' }])
			);
			dispatch(setProfile(name));
			LocalStorageService.set(LS_GAME_LOBBY, [
				...gameLobby.entries,
				{ player: name, channel: '' }
			]);
			SessionStorageService.set(SS_PROFILE, { name });
		}
	};

	const handleUsernameChange = function (e) {
		const name = e.target.value;
		setUsername(name);
	};

	const isUsernameValid = () =>
		username.length && username.length <= VALID_USERNAME_LENGTH;

	return (
		<div className="board-container">
			<LeaderBoard />
			{gameChannel.isGameVisible ? (
				<GameArea />
			) : (
				<>
					{profile && profile.name ? (
						<GameLobby />
					) : (
						<div className="username-input-container">
							<input
								type="text"
								id="username"
								value={username}
								onChange={handleUsernameChange}
								className="username-input"
								placeholder="Enter Username"
							/>
							<button
								className="add-username-btn"
								disabled={!isUsernameValid()}
								onClick={addUsername}
							>
								Join
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Board;
