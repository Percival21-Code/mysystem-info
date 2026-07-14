import { httpClient } from "./httpClient";
import type { Site } from "../types/siteTypes";

const mmapi_baseurl = import.meta.env.VITE_MMAPI_BASE_URL;

type MiddlewareSite = {
	siteID: string;
	customerNo: string;
	siteName: string | null;
	status: string;
	name: string;
	add1: string;
	add2: string;
	add3: string;
	add4: string;
	postCode: string;
	propertyReferenceNo: string | null;
};

type MiddlewareSitesResponse = {
	items: MiddlewareSite[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

type SitesResponse = {
	items: Site[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

type MiddlewareTokenResponse = {
	accessToken: string;
}

const mapMiddlewareSiteToSite = (site: MiddlewareSite): Site => {
	return {
		siteId: site.siteID ?? "",
		customerNo: site.customerNo ?? "",
		siteName: site.siteName ?? site.name ?? "",
		status: site.status ?? "",
		name: site.name ?? "",
		add1: site.add1 ?? "",
		add2: site.add2 ?? "",
		add3: site.add3 ?? "",
		add4: site.add4 ?? "",
		postCode: site.postCode ?? "",
		propertyReferenceNo: site.propertyReferenceNo ?? "",
	};
};

export const sitesApi = {
	getMiddlewareToken: async (): Promise<string> => {
		const response = await httpClient<MiddlewareTokenResponse>(
			"/api/middleware/token",
			{
				method: "POST",
			}
		);

		return response.accessToken;
	},

	middlewareGet: async <T>(path: string): Promise<T> => {
		const middlewareToken = await sitesApi.getMiddlewareToken();

		const response = await fetch(`${mmapi_baseurl}${path}`, {
			headers: {
				Authorization: `Bearer ${middlewareToken}`,
			},
		});

		if (response.status === 401) {
			localStorage.removeItem("mysystem_token");

			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}

			throw new Error("Your session has expired. Please log in again.");
		}

		if (!response.ok) {
			throw new Error(await response.text());
		}

		return response.json() as Promise<T>;
	},

	getSitesByCustomerNo: async (
		customerNo: string,
		page: number = 1,
		pageSize: number = 50,
		status?: string,
		siteId?: string,
		postCode?: string
	): Promise<SitesResponse> => {
		const cleanCustomerNo = customerNo.trim().toUpperCase();
		const cleanStatus = status?.trim().toUpperCase() ?? "";
		const cleanSiteId = siteId?.trim().toUpperCase() ?? "";
		const cleanPostCode = postCode?.trim().toUpperCase() ?? "";

		if (!cleanCustomerNo) {
			throw new Error("Customer Number was not passed into the Sites API Request.");
		}

		if (cleanStatus && cleanStatus !== "L" && cleanStatus !== "D") {
			throw new Error(
				"Status may only be assigned a value of 'L' (Live) or 'D' (Dead) or left blank."
			);
		}

		const cleanPage = page > 0 ? page : 1;
		const cleanPageSize = Math.min(Math.max(pageSize, 1), 100);

		const params = new URLSearchParams();

		params.set("customerNo", cleanCustomerNo);
		params.set("page", cleanPage.toString());
		params.set("pageSize", cleanPageSize.toString());

		if (cleanStatus) {
			params.set("status", cleanStatus);
		}

		if (cleanSiteId) {
			params.set("siteId", cleanSiteId);
		}

		if (cleanPostCode) {
			params.set("postCode", cleanPostCode);
		}

		const response = await sitesApi.middlewareGet<MiddlewareSitesResponse>(
			`/api/sites?${params.toString()}`
		);

		return {
			items: response.items.map(mapMiddlewareSiteToSite),
			page: response.page,
			pageSize: response.pageSize,
			total: response.total,
			hasMore: response.hasMore,
		};
	},

	getSiteById: async (siteId: string): Promise<Site> => {
		const cleanSiteId = siteId.trim().toUpperCase();

		if (!cleanSiteId) {
			throw new Error("Site ID is required.");
		}

		const params = new URLSearchParams({
			siteId: cleanSiteId,
		});

		const response =
			await sitesApi.middlewareGet<MiddlewareSitesResponse>(
				`/api/sites?${params.toString()}`
			);

		const site = response.items[0];

		if (!site) {
			throw new Error(`Site ${cleanSiteId} was not found.`);
		}

		return mapMiddlewareSiteToSite(site);
	},
};