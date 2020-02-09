import { createGlobalStyle, css } from 'styled-components';

export const theme = {
	colors: {
		dark_blue: '#15202B',
		blue: '#253341',
		twitter_blue: '#1DA1F2',
		twitter_border: '#38444d'
	}
};

export default createGlobalStyle`
body {
	font-family: 'Roboto', sans-serif;
}
input {
	outline: none;
}
.h {
	&-85 {
		height: 85%;
	}
	&-100 {
		height: 100%;
	}
}	
.br {
	&-50 {
		border-radius: 50%;
	}
}
.w {
	&-mx {
		&-30 {
			max-width: 30%;
		}
	}
	&-30 {
		width: 30%;
	}
	&-50 {
		width: 50%;
	}
	&-70 {
		width: 70%;
	}
	&-100 {
		width: 100%;
	}
}
.m {
	&-0 {
		margin: 0;
	}
	&r {
		&-1 {
			margin-right: 1rem;
		}
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
	&b {
		&-0 {
			margin-bottom: 0;
		}
		&-1 {
			margin-bottom: 1rem;
		}
	}
}
.p {
	&-1 {
		padding: 1rem;
	}
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
.align {
	&-items {
		&-center {
			align-items: center;
		}
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
.of {
	&-contain {
		object-fit: contain;
	}
	&-cover {
		object-fit: cover;
	}
}
@keyframes shine-avatar {
  0% {
    background-position: -32px;
  }
  40%, 100% {
    background-position: 208px;
  }
}
@keyframes shine-lines {
  0% {
    background-position: -100px;
  }
  40%, 100% {
    background-position: 140px;
  }
}
`;

export const avatarSkeleton = css`
	width: 100px;
	height: 100px;
	background-color: #ccc;
	border-radius: 50%;
	background-image: linear-gradient(90deg, #f4f4f4 0px, rgba(229, 229, 229, 0.8) 40px, #f4f4f4 80px);
	animation: shine-avatar 2s infinite ease-out;
	background-size: 100px;
`;

export const lineSkeleton = (width: number) => css`
	background-size: ${width * 5}px;
	background-color: #ccc;
	width: ${width}px;
	border-radius: 7px;
	margin-top: 16px;
	background-image: linear-gradient(90deg, #f4f4f4 0px, rgba(229, 229, 229, 0.8) 40px, #f4f4f4 80px);
	animation: shine-lines 2s infinite ease-out;
`;
