import React, { ReactElement, useEffect, useRef } from 'react';
import { useConnect } from 'redux-bundler-hook';
import styled from 'styled-components';

import { Flex, Text } from '../common/primitives';
import clock from '../assets/clock.svg';

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
const getTickerTime = value => value / 1000;

export default function Clock(): ReactElement {
	const { isSessionActive, tickerRemainingTime, doChangeInternalTickerState } = useConnect(
		'selectIsSessionActive',
		'doChangeInternalTickerState',
		'selectTickerRemainingTime'
	);
	const interval = useRef<number>(0);

	useEffect(() => {
		if (isSessionActive && !interval.current) {
			interval.current = setInterval(() => {
				doChangeInternalTickerState(INTERVAL_BASE);
			}, INTERVAL_BASE);
		}
		return () => {
			clearInterval(interval.current);
		};
	}, [isSessionActive]);

	return (
		<Flex className="h-100" alignItems="center">
			<ClockImage src={clock} alt="ticker" />
			<Ticker>{getTickerTime(tickerRemainingTime)}</Ticker>
		</Flex>
	);
}
