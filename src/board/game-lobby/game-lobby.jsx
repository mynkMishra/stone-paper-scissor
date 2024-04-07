import { useDispatch, useSelector } from 'react-redux';
import './game-lobby.css';
import {
	CURRENT_TURN,
	GAME_STATUS,
	LS_GAME_LOBBY,
	SS_PROFILE
} from '../../utils/constant';
import {
	selectProfile,
	setLinkedChannel,
	setProfile
} from '../../store/profile.slice';
import {
	selectGameLobby,
	setGameLobbyEntries
} from '../../store/game-lobby.slice';
import LocalStorageService from '../../utils/local-storage.service';
import SessionStorageService from '../../utils/session-storage.service';
import { useEffect } from 'react';

function GameLobby() {
	const dispatch = useDispatch();
	const profile = useSelector(selectProfile);
	const gameLobby = useSelector(selectGameLobby);

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

	const startGame = function (player_two) {
		const player_one = profile.name;

		const channelName = `channel-${player_one}-${player_two}`;
		const updatedLobby = gameLobby.entries.map((el) => {
			if (el.player === player_one) {
				return { ...el, channel: channelName };
			} else if (el.player === player_two) {
				return { ...el, channel: channelName };
			} else {
				return { ...el };
			}
		});
		dispatch(setLinkedChannel(channelName));
		dispatch(setGameLobbyEntries(updatedLobby));
		LocalStorageService.set(LS_GAME_LOBBY, [...updatedLobby]);
		LocalStorageService.set(channelName, {
			playerOne: player_one,
			playerTwo: player_two,
			playerOneOption: '',
			playerTwoOption: '',
			channelName,
			isGameVisible: true,
			status: GAME_STATUS.IN_PROGRESS,
			currentTurn: CURRENT_TURN.PLAYER_ONE
		});
	};

	const getPlayersForGameLobby = function () {
		const players = gameLobby.entries.filter(
			(el) => el.player !== profile.name && !el.channel
		);

		return players;
	};

	return (
		<>
			<div className="game-lobby-container">
				<h4 className="lobby-heading">Game Lobby</h4>
				<div className="lobby-container">
					{!getPlayersForGameLobby().length ? (
						<div className="waiting-msg">Waiting for others to join ...</div>
					) : (
						<>
							{getPlayersForGameLobby().map((el) => {
								return (
									<div
										className="lobby-entry"
										key={el.player}
										onClick={() => startGame(el.player)}
									>
										<div className="lobby-user">{el.player}</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default GameLobby;
