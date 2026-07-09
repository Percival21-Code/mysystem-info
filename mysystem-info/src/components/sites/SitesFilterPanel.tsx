import type { SiteFilters } from "../../data/types/siteTypes";

type SitesFilterPanelProps = {
	filters: SiteFilters;
	onFiltersChange: (filters: SiteFilters) => void;
};

const SitesFilterPanel = ({
	filters,
	onFiltersChange,
}: SitesFilterPanelProps) => {
	return (
		<section className="sites-filter-panel">
			<input
				type="text"
				placeholder="Site ID"
				value={filters.siteId}
				onChange={(e) =>
					onFiltersChange({
						...filters,
						siteId: e.target.value,
					})
				}
			/>

			<input
				type="text"
				placeholder="Site Name"
				value={filters.siteName}
				onChange={(e) =>
					onFiltersChange({
						...filters,
						siteName: e.target.value,
					})
				}
			/>

			<input
				type="text"
				placeholder="Post Code"
				value={filters.postCode}
				onChange={(e) =>
					onFiltersChange({
						...filters,
						postCode: e.target.value,
					})
				}
			/>

			<input
				type="text"
				placeholder="Status L/D"
				value={filters.status}
				onChange={(e) =>
					onFiltersChange({
						...filters,
						status: e.target.value,
					})
				}
			/>
		</section>
	);
};

export default SitesFilterPanel;