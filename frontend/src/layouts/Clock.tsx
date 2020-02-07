import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useConnect } from 'redux-bundler-hook';
import styled from 'styled-components';

import { Flex } from '../common/primitives';
import clock from '../assets/clock.svg';
import Spinner from './Spinner';

const ClockImage = styled.img`
	height: 75%;
`;
const Ticker = styled.span`
	color: white;
	font-size: 30px;
	font-weight: bold;
	padding: 0 1rem;
`;

const INTERVAL_BASE = 1000;

export default function Clock(): ReactElement {
	const { isSessionActive, tickerRemainingTime, scheduledUpdateCount } = useConnect(
		'selectIsSessionActive',
		'selectScheduledUpdateCount',
		'selectTickerRemainingTime'
	);
	const interval = useRef<number>(0);
	const [sessionTime, handleSessionTimeChange] = useState(0);

	useEffect(() => {
		if (isSessionActive && !interval.current) {
			interval.current = setInterval(() => {
				handleSessionTimeChange(prevState => prevState - INTERVAL_BASE);
			}, INTERVAL_BASE);
		}
		return () => {
			clearInterval(interval.current);
		};
	}, [isSessionActive]);

	useEffect(() => {
		if (sessionTime === 0) {
			clearInterval(interval.current);
		}
	}, [sessionTime]);

	useEffect(() => {
		handleSessionTimeChange(tickerRemainingTime);
	}, [scheduledUpdateCount, tickerRemainingTime]);

	return (
		<Flex className="h-100" alignItems="center">
			<ClockImage src={clock} alt="ticker" />
			{!tickerRemainingTime ? <Spinner /> : <Ticker>{sessionTime / 1000}</Ticker>}
		</Flex>
	);
}
