import React, { ReactChild, ReactElement } from 'react';

type Props = {
	children: ReactChild,
	routeId: string,
}

export default function AppLayout({ children, routeId }: Props): ReactElement {
	return <div>{children}</div>
}