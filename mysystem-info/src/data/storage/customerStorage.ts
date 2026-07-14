// keep customer no in local storage between page changes 

export const CUSTOMER_NO_STORAGE_KEY = "mysystem_customer_no";

export const getStoredCustomerNo = (): string => {
	return localStorage.getItem(CUSTOMER_NO_STORAGE_KEY) ?? "";
};

export const setStoredCustomerNo = (customerNo: string): void => {
	const cleanCustomerNo = customerNo.trim().toUpperCase();

	if (!cleanCustomerNo) {
		localStorage.removeItem(CUSTOMER_NO_STORAGE_KEY);
		return;
	}

	localStorage.setItem(
		CUSTOMER_NO_STORAGE_KEY,
		cleanCustomerNo
	);
};

export const clearStoredCustomerNo = (): void => {
	localStorage.removeItem(CUSTOMER_NO_STORAGE_KEY);
};