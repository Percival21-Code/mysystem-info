import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { UserRole } from "./authTypes";

type RoleRouteProps = {
	allowedRoles: UserRole[];
};

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return <p>Loading...</p>;
	}

	const allowed = user?.roles.some((role) => allowedRoles.includes(role));

	if (!allowed) {
		return (
			<Navigate
				to="/unauthorized"
				replace
			/>
		);
	}

	return <Outlet />;
};
