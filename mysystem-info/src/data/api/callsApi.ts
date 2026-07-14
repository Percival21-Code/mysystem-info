import type {
	Call,
} from "../types/callTypes";
import { httpClient } from "./httpClient";
import { getCallStatusLabel, getCallTypeLabel } from "../types/callMappings";

const mmapi_baseurl = import.meta.env.VITE_MMAPI_BASE_URL;

type MiddlewareCall = {
	callNumber: number;
	callType: string;
	callStatus: string;
	siteID: string;
	loggedDate: string;
	loggingOperator: string;
	engineer: string;
	systemType: string;

	completedDate: string | null;
	customerReference: string;
	invoiceNo: string;
	loggedRemarks: string;
	completedRemarks: string;
	previousMaintenanceDate: string | null;
	nextMaintenanceDate: string | null;
};

type MiddlewareCallsResponse = {
	items: MiddlewareCall[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

type CallsResponse = {
	items: Call[];
	page: number;
	pageSize: number;
	total: number;
	hasMore: boolean;
};

const mapMiddlewareCallToCall = (
	call: MiddlewareCall
): Call => {
	return {
		callNumber: call.callNumber,
		callType: getCallTypeLabel(call.callType),
		callStatus: getCallStatusLabel(call.callStatus),
		siteId: call.siteID ?? "",
		loggedDate: call.loggedDate ?? "",
		loggingOperator: call.loggingOperator ?? "",
		engineer: call.engineer ?? "",
		systemType: call.systemType ?? "",

		completedDate: call.completedDate ?? "",
		customerReference: call.customerReference ?? "",
		invoiceNo: call.invoiceNo ?? "",
		loggedRemarks: call.loggedRemarks ?? "",
		completedRemarks: call.completedRemarks ?? "",
		previousMaintenanceDate:
			call.previousMaintenanceDate ?? null,
		nextMaintenanceDate:
			call.nextMaintenanceDate ?? null,
	};
};

type MiddlewareTokenResponse = {
	accessToken: string;
}

export const callsApi = {
	getMiddlewareToken: async (): Promise<string> => {
        const response = await httpClient<MiddlewareTokenResponse>(
            "/api/middleware/token", 
            { method: "POST", }
        );

        return response.accessToken;
    },

    middlewareGet: async <T>(path: string): Promise<T> => {
        const middlewareToken = await callsApi.getMiddlewareToken();

        const response = await fetch(`${mmapi_baseurl}${path}`, {
            headers: {
                Authorization: `Bearer ${middlewareToken}`,
            }
        });

        // expired token
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

    getCallsForTable: async (
        customerNo: string,
        siteId: string,
        callNumber: number,
        loggedFrom: string,
        loggedTo: string,
        engineer: string,
        systemType: string,
        page: number,
        pageSize: number
    ): Promise<CallsResponse> => {
        const cleanCustomerNo = customerNo.trim().toUpperCase();
        const cleanSiteId = siteId.trim().toUpperCase();
        const cleanCallNumber =
            callNumber > 0
                ? callNumber.toString()
                : "";
        const cleanLoggedFrom = loggedFrom.trim();
        const cleanLoggedTo = loggedTo.trim();
        const cleanEngineer = engineer.trim().toUpperCase();
        const cleanSystemType = systemType.trim().toUpperCase();
        
        if (!cleanCustomerNo) {
            throw new Error("Customer Number was not passed into the Calls API Request.");
        }

        const cleanPage = page > 0 ? page : 1;
        const cleanPageSize = Math.min(Math.max(pageSize, 1), 100);

        const params = new URLSearchParams();

        params.set("customerNo", cleanCustomerNo);
        
        if (cleanSiteId) { params.set("siteId", cleanSiteId); }
        if (cleanCallNumber) { params.set("callNumber", cleanCallNumber); }
        if (cleanLoggedFrom) { params.set("loggedFrom", cleanLoggedFrom); }
        if (cleanLoggedTo) { params.set("loggedTo", cleanLoggedTo); }
        if (cleanEngineer) { params.set("engineer", cleanEngineer); }
        if (cleanSystemType) { params.set("systemType", cleanSystemType); }
        params.set("page", cleanPage.toString());
        params.set("pageSize", cleanPageSize.toString());

        const response =
            await callsApi.middlewareGet<MiddlewareCallsResponse>(
                `/api/calls?${params.toString()}`
            );

        return {
            items: response.items.map(mapMiddlewareCallToCall),
            page: response.page,
            pageSize: response.pageSize,
            total: response.total,
            hasMore: response.hasMore
        };
    },

    // getCallByNumber: async(
    //     callNumber: number
    // ): Promise<Call> => {
    //     // get details for one call
    // }
};

export default callsApi;