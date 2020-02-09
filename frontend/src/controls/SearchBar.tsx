import React  from 'react';
import { useConnect } from 'redux-bundler-hook'

export default function SearchBar() {
	const {} = useConnect('selectSearchedUser', 'selectSuggestedUsers')
}