import { createGlobalStyle } from 'styled-components';

export const theme = {
	colors: {
		dark_blue: '#15202B',
		blue: '#253341',
		twitter_blue: '#1DA1F2'
	}
};

export default createGlobalStyle`
body {
	font-family: 'Roboto', sans-serif;
}
input {
	outline: none;
}
.h-100 {
		height: 100%;
}	
.w-100 {
		width: 100%;
}
.m {
	&-0 {
		margin: 0;
	}
	&v {
		&-1 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
		&-2 {
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	}
	&t {
		&-4 {
			margin-top: 4rem;
		}
		&-negative {
			&-2 {
				margin-top: -2rem;
			}
		}
	}
}
.p {
	&v {
		&-1 {
		padding-left: 1rem;
		padding-right: 1rem;
		}
	}
}
.d {
	&-flex {
		display: flex;
	}
}
.justify {
	&-content {
		&-center {
			justify-content: center;
		}
	}
}
.pointer {
	cursor: pointer;
}
`;
