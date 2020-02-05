import { OpaqueInterpolation, useSpring, config as conf, SpringConfig } from 'react-spring';

type UseScaleProps = {
	initialScale: number;
	toScale: number;
	duration?: number;
	config?: SpringConfig;
};

type ScaleHandlers = {
	handleMouseOver: () => void;
	handleMouseLeave: () => void;
	scale: OpaqueInterpolation<number>;
};

export default function useScale({
	initialScale = 1,
	toScale = 2,
	config = conf.default
}: UseScaleProps): ScaleHandlers {
	const [{ sc }, set] = useSpring(() => ({
		sc: initialScale,
		config
	}));

	const handleMouseOver = () => {
		set({ sc: toScale });
	};

	const handleMouseLeave = () => {
		set({ sc: initialScale });
	};

	return { handleMouseOver, handleMouseLeave, scale: sc };
}
