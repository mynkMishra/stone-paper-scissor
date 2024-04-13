import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './game-area.css';
import {
	CURRENT_TURN,
	GAME_STATUS,
	LS_GAME_LOBBY,
	LS_LEADERBOARD,
	OPTIONS
} from '../../utils/constant';
import { selectProfile } from '../../store/profile.slice';
import LocalStorageService from '../../utils/local-storage.service';
import {
	resetGameChannel,
	selectGameChannel,
	setGameChannel
} from '../../store/game-channel.slice';
import rock from '../../assets/rock.png';
import paper from '../../assets/paper.png';
import scissors from '../../assets/scissors.png';
import question from '../../assets/question.png';
import waiting from '../../assets/waiting.png';
import {
	selectGameLobby,
	setGameLobbyEntries
} from '../../store/game-lobby.slice';

function GameArea() {
	const dispatch = useDispatch();
	const profile = useSelector(selectProfile);
	const gameChannel = useSelector(selectGameChannel);
	const gameLobby = useSelector(selectGameLobby);
	const [playerOne, setPlayerOne] = useState();
	const [playerTwo, setPlayerTwo] = useState();
	const [currentTurn, setCurrentTurn] = useState();
	const [playerOneOption, setPlayerOneOption] = useState();
	const [playerTwoOption, setPlayerTwoOption] = useState();
	const [winningStatus, setWinningStatus] = useState();

	useEffect(() => {
		window.addEventListener('storage', (e) => {
			if (e.key === gameChannel.channelName) {
				if (e.newValue) {
					dispatch(setGameChannel(JSON.parse(e.newValue)));
				} else {
					dispatch(resetGameChannel());
				}
			}
		});
	}, []);

	useEffect(() => {
		if (
			gameChannel.isGameVisible &&
			gameChannel.status === GAME_STATUS.IN_PROGRESS
		) {
			const {
				playerOne,
				playerTwo,
				currentTurn,
				playerOneOption,
				playerTwoOption
			} = gameChannel;
			setPlayerOne(playerOne);
			setPlayerTwo(playerTwo);
			setCurrentTurn(currentTurn);
			setPlayerOneOption(playerOneOption);
			setPlayerTwoOption(playerTwoOption);
		}
	}, [gameChannel]);

	const handleOptionSelection = function (option) {
		if (currentTurn === CURRENT_TURN.PLAYER_ONE) {
			setPlayerOneOption(option);
			setCurrentTurn(CURRENT_TURN.PLAYER_TWO);
			LocalStorageService.set(gameChannel.channelName, {
				...gameChannel,
				playerOneOption: option,
				currentTurn: CURRENT_TURN.PLAYER_TWO
			});
		} else {
			setPlayerTwoOption(option);
			LocalStorageService.set(gameChannel.channelName, {
				...gameChannel,
				playerTwoOption: option
			});
		}
	};

	const renderOption = function (option, applyHandler) {
		if (option === OPTIONS.ROCK) {
			return (
				<div
					className={`option rock ${applyHandler ? '' : 'option-without-action'}`}
					onClick={applyHandler ? () => handleOptionSelection(OPTIONS.ROCK) : null}
				>
					<img className="rock-img" src={rock} alt="rock" />
					<div className="option-title">Rock</div>
				</div>
			);
		}

		if (option === OPTIONS.PAPER) {
			return (
				<div
					className={`option paper ${applyHandler ? '' : 'option-without-action'}`}
					onClick={applyHandler ? () => handleOptionSelection(OPTIONS.PAPER) : null}
				>
					<img className="paper-img" src={paper} alt="paper" />
					<div className="option-title">Paper</div>
				</div>
			);
		}

		if (option === OPTIONS.SCISSORS) {
			return (
				<div
					className={`option scissors ${applyHandler ? '' : 'option-without-action'}`}
					onClick={
						applyHandler ? () => handleOptionSelection(OPTIONS.SCISSORS) : null
					}
				>
					<img className="scissors-img" src={scissors} alt="scissors" />
					<div className="option-title">Scissors</div>
				</div>
			);
		}
	};

	const renderViewForPlayerOne = function () {
		if (!playerOneOption && currentTurn === CURRENT_TURN.PLAYER_ONE) {
			return (
				<>
					<div
						className={`player-one-container ${profile.name === playerOne ? 'my-game-box' : 'current'}`}
					>
						<h4 className="player-name">Player : {playerOne}</h4>
						<div className="avatar-container">{playerOne.at(0)}</div>
						<div className="options-container">
							{renderOption(OPTIONS.ROCK, true)}
							{renderOption(OPTIONS.PAPER, true)}
							{renderOption(OPTIONS.SCISSORS, true)}
						</div>
					</div>
					<div
						className={`player-two-container ${profile.name === playerTwo ? 'my-game-box' : 'current'}`}
					>
						<h4>Player : {playerTwo}</h4>
						<div className="avatar-container">{playerTwo.at(0)}</div>
						<div className="options-container">
							<div className={`option-without-action`}>
								<img className="waiting-img" src={waiting} alt="waiting" />
							</div>
						</div>
						<div className="selected-label">Waiting ...</div>
					</div>
				</>
			);
		}

		if (playerOneOption && currentTurn === CURRENT_TURN.PLAYER_TWO) {
			return (
				<>
					<div
						className={`player-one-container ${profile.name === playerOne ? 'my-game-box' : 'current'}`}
					>
						<h4 className="player-name">Player : {playerOne}</h4>
						<div className="avatar-container">{playerOne.at(0)}</div>
						<div className="options-container">
							{renderOption(playerOneOption, false)}
						</div>
						<div className="selected-label">Selected</div>
					</div>
					<div
						className={`player-two-container ${profile.name === playerTwo ? 'my-game-box' : 'current'}`}
					>
						<h4>Player : {playerTwo}</h4>
						<div className="avatar-container">{playerTwo.at(0)}</div>
						<div className="options-container">
							<div className={`option-without-action`}>
								<img className="waiting-img" src={waiting} alt="waiting" />
							</div>
						</div>
						<div className="selected-label">Selecting ...</div>
					</div>
				</>
			);
		}
	};

	const renderViewForPlayerTwo = function () {
		if (!playerOneOption && currentTurn === CURRENT_TURN.PLAYER_ONE) {
			return (
				<>
					<div
						className={`player-one-container ${profile.name === playerOne ? 'my-game-box' : 'current'}`}
					>
						<h4 className="player-name">Player : {playerOne}</h4>
						<div className="avatar-container">{playerOne.at(0)}</div>
						<div className="options-container">
							<div className={`option-without-action`}>
								<img className="waiting-img" src={waiting} alt="waiting" />
							</div>
						</div>
						<div className="selected-label">Selecting ...</div>
					</div>
					<div
						className={`player-two-container ${profile.name === playerTwo ? 'my-game-box' : 'current'}`}
					>
						<h4>Player : {playerTwo}</h4>
						<div className="avatar-container">{playerTwo.at(0)}</div>
						<div className="options-container">
							<div className={`option-without-action`}>
								<img className="waiting-img" src={waiting} alt="waiting" />
							</div>
						</div>
						<div className="selected-label">Hold ...</div>
					</div>
				</>
			);
		}

		if (playerOneOption && currentTurn === CURRENT_TURN.PLAYER_TWO) {
			return (
				<>
					<div
						className={`player-one-container ${profile.name === playerOne ? 'my-game-box' : 'current'}`}
					>
						<h4 className="player-name">Player : {playerOne}</h4>
						<div className="avatar-container">{playerTwo.at(0)}</div>
						<div className="options-container">
							<div className={`option-without-action`}>
								<img className="question-img" src={question} alt="selected" />
							</div>
						</div>
						<div className="selected-label">Selected</div>
					</div>
					<div
						className={`player-two-container ${profile.name === playerTwo ? 'my-game-box' : 'current'}`}
					>
						<h4>Player : {playerTwo}</h4>
						<div className="avatar-container">{playerTwo.at(0)}</div>
						<div className="options-container">
							{renderOption(OPTIONS.ROCK, true)}
							{renderOption(OPTIONS.PAPER, true)}
							{renderOption(OPTIONS.SCISSORS, true)}
						</div>
					</div>
				</>
			);
		}
	};

	useEffect(() => {
		if (!winningStatus || winningStatus === 'draw') {
			return;
		}

		let playerName;
		if (winningStatus === CURRENT_TURN.PLAYER_ONE) {
			playerName = gameChannel.playerOne;
		} else {
			playerName = gameChannel.playerTwo;
		}
		const leaderboard = LocalStorageService.get(LS_LEADERBOARD) ?? [];
		const entryExists =
			leaderboard.findIndex((el) => el.player === playerName) !== -1;

		let updatedLeaderBoard;
		if (entryExists) {
			updatedLeaderBoard = leaderboard.map((el) => {
				if (el.player === playerName) {
					return { ...el, score: el.score + 1 };
				}
				return el;
			});
		} else {
			updatedLeaderBoard = [...leaderboard, { player: playerName, score: 1 }];
		}

		LocalStorageService.set(LS_LEADERBOARD, updatedLeaderBoard);
	}, [winningStatus]);

	const renderResult = function () {
		if (!winningStatus) {
			let winner;
			if (playerOneOption === OPTIONS.ROCK) {
				if (playerTwoOption === OPTIONS.ROCK) {
					winner = null;
				} else if (playerTwoOption === OPTIONS.PAPER) {
					winner = CURRENT_TURN.PLAYER_TWO;
				} else {
					winner = CURRENT_TURN.PLAYER_ONE;
				}
			} else if (playerOneOption === OPTIONS.PAPER) {
				if (playerTwoOption === OPTIONS.ROCK) {
					winner = CURRENT_TURN.PLAYER_ONE;
				} else if (playerTwoOption === OPTIONS.PAPER) {
					winner = null;
				} else {
					winner = CURRENT_TURN.PLAYER_TWO;
				}
			} else {
				if (playerTwoOption === OPTIONS.ROCK) {
					winner = CURRENT_TURN.PLAYER_TWO;
				} else if (playerTwoOption === OPTIONS.PAPER) {
					winner = CURRENT_TURN.PLAYER_ONE;
				} else {
					winner = null;
				}
			}
			if (winner) {
				setWinningStatus(winner);
			} else {
				setWinningStatus('draw');
			}
		}

		return (
			<>
				<div className="player-one-container">
					<h4 className="player-name">Player : {playerOne}</h4>
					<div className="avatar-container">{playerOne.at(0)}</div>
					<div className="options-container">
						{renderOption(playerOneOption, false)}
					</div>
					{winningStatus === 'draw' && <div className="result-label">Draw</div>}
					{winningStatus === CURRENT_TURN.PLAYER_ONE && (
						<div className="result-label">Winner</div>
					)}
				</div>
				<div className="player-two-container">
					<h4>Player : {playerTwo}</h4>
					<div className="avatar-container">{playerTwo.at(0)}</div>
					<div className="options-container">
						{renderOption(playerTwoOption, false)}
					</div>
					{winningStatus === 'draw' && <div className="result-label">Draw</div>}
					{winningStatus === CURRENT_TURN.PLAYER_TWO && (
						<div className="result-label">Winner</div>
					)}
				</div>
			</>
		);
	};

	const handlePlayAgain = function () {
		const channelName = gameChannel.channelName;

		const updatedLobby = gameLobby.entries.map((el) => {
			if (el.channel === channelName) {
				return { ...el, channel: '' };
			}
			return el;
		});

		dispatch(setGameLobbyEntries([...updatedLobby]));
		dispatch(resetGameChannel());
		LocalStorageService.set(LS_GAME_LOBBY, updatedLobby);
		LocalStorageService.remove(channelName);
	};

	return (
		<div className="game-area-container">
			{playerOneOption && playerTwoOption && (
				<button className="play-again-btn" onClick={() => handlePlayAgain()}>
					Play Again
				</button>
			)}
			{playerOneOption && playerTwoOption ? (
				<>{renderResult()}</>
			) : (
				<>
					{profile &&
						playerOne &&
						profile.name === playerOne &&
						renderViewForPlayerOne()}
					{profile &&
						playerTwo &&
						profile.name === playerTwo &&
						renderViewForPlayerTwo()}
				</>
			)}
		</div>
	);
}

export default GameArea;
