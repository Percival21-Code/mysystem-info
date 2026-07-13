export type Call = {
	callNumber: string;
	callType: string;
	callStatus: string;
	siteId: string;
	loggedDate: string;
	loggingOperator: string;
	engineer: string;
	systemType: string;
};

export type CallFilters = {
	siteId: string;
	loggedFrom: string;
	loggedTo: string;
	systemType: string;
};