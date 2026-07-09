const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = async <T>(
	path: string,
	options: RequestInit = {}
): Promise<T> => {
	const token = localStorage.getItem("mysystem_token");

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	// unauthorised - token expired/incorrect
	if (response.status === 401) {
		localStorage.removeItem("mysystem_token");

		if (window.location.pathname !== "/login") {
			window.location.href = "/login";
		}

		throw new Error("Your session has expired; please log in again.");
	}

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Request failed.");
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
};