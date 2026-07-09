import type { AuthUser } from "./authTypes";

export const getHomeRouteForUser = (user: AuthUser) => {
	if (user.roles.includes("Administrator")) return "/admin";
	if (user.roles.includes("Staff")) return "/staff";
	if (user.roles.includes("Engineer")) return "/staff";
	if (user.roles.includes("CustomerUser")) return "/customer";
	if (user.roles.includes("SiteUser")) return "/site";

	return "/unauthorized";
};