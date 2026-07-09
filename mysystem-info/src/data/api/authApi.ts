import { httpClient } from "./httpClient";
import type { AuthUser, LoginRequest, LoginResponse } from "../auth/authTypes";

export const authApi = {
	login: (request: LoginRequest) =>
		httpClient<LoginResponse>("/api/auth/login", {
			method: "POST",
			body: JSON.stringify(request),
		}),

	me: () => httpClient<AuthUser>("/api/auth/me"),
};