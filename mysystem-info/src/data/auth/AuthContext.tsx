import { createContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import type { AuthState, AuthUser, LoginRequest } from "./authTypes";

type AuthContextValue = AuthState & {
	login: (request: LoginRequest) => Promise<AuthUser>;
	logout: () => void;
	hasRole: (...roles: string[]) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("mysystem_token"),
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadCurrentUser = async () => {
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const currentUser = await authApi.me();
				setUser(currentUser);
			} catch {
				localStorage.removeItem("mysystem_token");
				setToken(null);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadCurrentUser();
	}, [token]);

	const login = async (request: LoginRequest) => {
		const response = await authApi.login(request);

		localStorage.setItem("mysystem_token", response.token);
		setToken(response.token);
		setUser(response.user);

		return response.user;
	};

	const logout = () => {
		localStorage.removeItem("mysystem_token");
		setToken(null);
		setUser(null);
	};

	const hasRole = (...roles: string[]) => {
		return user?.roles.some((role) => roles.includes(role)) ?? false;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isAuthenticated: !!user && !!token,
				isLoading,
				login,
				logout,
				hasRole,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
