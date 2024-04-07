import { useEffect, useState } from 'react';
import './leaderboard.css';
import LocalStorageService from '../../utils/local-storage.service';
import { LS_LEADERBOARD } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameLobby, setLeaderBoard } from '../../store/game-lobby.slice';

function LeaderBoard() {
	const dispatch = useDispatch();
	const gameLobby = useSelector(selectGameLobby);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const leaderboardVal = LocalStorageService.get(LS_LEADERBOARD);
		if (leaderboardVal) {
			dispatch(setLeaderBoard(leaderboardVal.sort((a, b) => b.score - a.score)));
		}
	}, []);

	useEffect(() => {
		window.addEventListener('storage', (e) => {
			if (e.key === LS_LEADERBOARD) {
				const leaderboard = JSON.parse(e.newValue);
				dispatch(setLeaderBoard(leaderboard.sort((a, b) => b.score - a.score)));
			}
		});
	}, []);
	return (
		<div className="leaderboard-container">
			<div className="title" onClick={() => setVisible(!visible)}>
				LeaderBoard
			</div>
			{visible ? (
				<div className="body">
					{gameLobby.leaderboard.length ? (
						gameLobby.leaderboard.map((el) => (
							<div className="entry" key={el.player}>
								<div className="player">{el.player}</div>
								<div className="score">{el.score}</div>
							</div>
						))
					) : (
						<div className="no-entry">Empty</div>
					)}
				</div>
			) : null}
		</div>
	);
}

export default LeaderBoard;
