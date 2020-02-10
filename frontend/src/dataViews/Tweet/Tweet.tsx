import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import { Flex, Text } from '../../common/primitives';
import { formatTime } from '../../common/formatters';
import { avatarSkeleton, lineSkeleton } from '../../common/globalStyles';

type Props = {
	text: string;
	avatar: string;
	user_name: string;
	first_name: string;
	last_name: string;
	isLoading?: boolean;
	created_at?: string;
};

const TweetContainer = styled(animated.div)`
	background-color: ${props => props.theme.colors.twitter_border};
	width: 100%;
	border-radius: 8px;
	height: 150px;
`;

const UserAvatar = styled(animated.img)`
	width: 100px;
	height: 100px;
	object-fit: cover;
	border-radius: 50%;
`;

const SkeletonAvatar = styled.div`
	${avatarSkeleton}
`;
const SkeletonText = styled.div<{ width: number }>`
	height: 20px;
	${props => lineSkeleton(props.width)}
`;

export default function Tweet({
	text,
	avatar,
	user_name,
	first_name,
	last_name,
	created_at,
	isLoading
}: Props): ReactElement {
	const { opacity } = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

	return (
		<TweetContainer style={{ opacity }}>
			<Flex className="h-100 pv-1" alignItems="center">
				<div className="w-30 h-100 d-flex align-items-center justify-content-center">
					{isLoading ? <SkeletonAvatar /> : <UserAvatar style={{ opacity }} src={avatar} alt="user avatar" />}
				</div>
				<Flex flexDirection="column" className="h-100 w-70 pv-1">
					{isLoading ? (
						<SkeletonText width={300} />
					) : (
						<Flex className="w-100">
							<Text color="white" className="mb-0">{`${first_name} ${last_name}`}</Text>{' '}
							<Text className="mb-0" color="white">
								@{user_name} | {formatTime(created_at)}
							</Text>
						</Flex>
					)}
					{isLoading ? (
						<>
							<SkeletonText width={320} />
							<SkeletonText width={320} />
						</>
					) : (
						<Text color="white" fontSize={16} unit="px">
							{text}
						</Text>
					)}
				</Flex>
			</Flex>
		</TweetContainer>
	);
}
