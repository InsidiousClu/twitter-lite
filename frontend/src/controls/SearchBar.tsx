import React, { ReactElement, useMemo } from 'react';
import { useTransition, animated, config } from 'react-spring';
import { useConnect } from 'redux-bundler-hook';
import debounce from 'lodash.debounce';
import styled from 'styled-components';

import { InputField } from './TextInput';
import { Text, Flex } from '../common/primitives';

const SearchBarContainer = styled(animated.div)`
	width: 35%;
	position: relative;
`;
const Suggestions = styled.div`
	position: absolute;
	top: 35px;

	width: calc(100% + 10px);
`;
const Suggestion = styled(animated.div)`
	height: 50px;
	padding: 1rem 2.5rem;
	background-color: ${props => props.theme.colors.blue};
	border-bottom: 1px solid ${props => props.theme.colors.twitter_border};
	cursor: pointer;
	transition: all 0.3s;
	z-index: 1;
	&:hover {
		background-color: ${props => props.theme.colors.dark_blue};
	}
`;

const Avatar = styled.img`
	width: 50px;
	height: 50px;
	object-fit: cover;
	border-radius: 50%;
	margin-right: 1rem;
`;

type Props = {
	onUserSelect: (id: number) => void;
};

export default function SearchBar({ onUserSelect }: Props): ReactElement {
	const { suggestedUsers, doUserSearch } = useConnect('selectSuggestedUsers', 'doUserSearch');
	const transitions = useTransition(suggestedUsers, user => user.id, {
		from: { transform: 'translate3d(0,-300px,0)', opacity: 0 },
		enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
		leave: { transform: 'translate3d(0,-300px,0)', opacity: 0 },
		config: { ...config.default, duration: 150 }
	});
	const handleSearch = useMemo(() => debounce(doUserSearch, 300), [doUserSearch]);

	const handleInputChange = event => {
		handleSearch(event.target.value);
	};

	return (
		<SearchBarContainer>
			<InputField placeholder="Search" backgroundColor="twitter_border" onChange={handleInputChange} />
			<Suggestions>
				{transitions.map(({ item, key, props }) => (
					<Suggestion onClick={() => onUserSelect(item.id)} key={key} style={props}>
						<Flex className="w-100 h-100">
							<Avatar src={item.avatar} />
							<Text color="white">{item.user_name}</Text>
						</Flex>
					</Suggestion>
				))}
			</Suggestions>
		</SearchBarContainer>
	);
}
