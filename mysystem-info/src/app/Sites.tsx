import "../styles/app-styles/Sites.css";
import SitesFilterPanel from "../components/sites/SitesFilterPanel";
import SitesTable from "../components/sites/SitesTable";
import SiteDetailsModal from "../components/sites/SiteDetailsModal";
import { useMemo, useState } from "react";
import { sitesApi } from "../data/api/sitesApi";
import type { Site, SiteFilters } from "../data/types/siteTypes";

const Sites = () => {
	const [customerNo, setCustomerNo] = useState("");
	const [searchedCustomerNo, setSearchedCustomerNo] = useState("");

	const [filters, setFilters] = useState<SiteFilters>({
        siteId: "",
        siteName: "",
        postCode: "",
        status: "",
    });

	const [sites, setSites] = useState<Site[]>([]);
	const [selectedSite, setSelectedSite] = useState<Site | null>(null);

	const [page, setPage] = useState(1);
	const [siteRows, setSiteRows] = useState(10);
	const [total, setTotal] = useState(0);
	const [hasMore, setHasMore] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const loadSites = async (pageToLoad = 1) => {
		setError("");

		if (!customerNo.trim()) {
			setError("Customer No is required.");
			return;
		}

		try {
			setIsLoading(true);

			const result = await sitesApi.getSitesByCustomerNo(
                customerNo.trim(),
                pageToLoad,
                siteRows,
                filters.status || ''
            );

			setSites(result.items);
			setPage(result.page);
			setTotal(result.total);
			setHasMore(result.hasMore);
			setSearchedCustomerNo(customerNo.trim());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load sites.");
		} finally {
			setIsLoading(false);
		}
	};

	const filteredSites = useMemo(() => {
        return sites.filter((site) => {
            const siteId = filters.siteId.toLowerCase().trim();
            const siteName = filters.siteName.toLowerCase().trim();
            const postCode = filters.postCode.toLowerCase().trim();
            const status = filters.status.toLowerCase().trim();

            const matchesSiteId =
                !siteId || site.siteId.toLowerCase().includes(siteId);

            const matchesSiteName =
                !siteName || site.siteName.toLowerCase().includes(siteName);

            const matchesPostCode =
                !postCode || site.postCode.toLowerCase().includes(postCode);

            const matchesStatus = 
                !status || site.status.toLowerCase().includes(status);

            return matchesSiteId && matchesSiteName && matchesPostCode && matchesStatus;
        });
    }, [sites, filters]);

	return (
		<div className="sites-screen">
			<div className="sites-header">
				<div>
					<h1>Sites</h1>

					{searchedCustomerNo && (
						<p>
							Showing customer <strong>{searchedCustomerNo}</strong>
						</p>
					)}
				</div>

				<div className="sites-customer-search">
					<input
						type="text"
						placeholder="Customer No"
						value={customerNo}
						onChange={(e) => setCustomerNo(e.target.value)}
					/>

					<button type="button" onClick={() => loadSites(1)}>
						Search
					</button>
				</div>
			</div>

			<div className="filters-section">
				<SitesFilterPanel filters={filters} onFiltersChange={setFilters} />
			</div>

			<div className="sites-toolbar">
				<p>
					{filteredSites.length} shown / {total} total
				</p>

				<label>
					Rows
					<input
						type="number"
						min={1}
						max={200}
						value={siteRows}
						onChange={(e) => setSiteRows(Number(e.target.value))}
					/>
				</label>
			</div>

			{error && <p className="sites-error">{error}</p>}
			{isLoading && <p>Loading sites...</p>}

			<div className="sites-view">
				<SitesTable
					sites={filteredSites}
					rowsToShow={siteRows}
					onSiteClick={setSelectedSite}
				/>
			</div>

			<div className="sites-pagination">
				<button
					type="button"
					disabled={page <= 1 || isLoading}
					onClick={() => loadSites(page - 1)}
				>
					Previous
				</button>

				<span>Page {page}</span>

				<button
					type="button"
					disabled={!hasMore || isLoading}
					onClick={() => loadSites(page + 1)}
				>
					Next
				</button>
			</div>

			{selectedSite && (
				<SiteDetailsModal
					site={selectedSite}
					onClose={() => setSelectedSite(null)}
				/>
			)}
		</div>
	);
};

export default Sites;