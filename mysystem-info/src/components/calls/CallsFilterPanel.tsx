import type { CallFilters } from "../../data/types/callTypes";

type CallsFilterPanelProps = {
	filters: CallFilters;
	onFiltersChange: (filters: CallFilters) => void;
};

const CallsFilterPanel = ({
	filters,
	onFiltersChange,
}: CallsFilterPanelProps) => {
	return (
		<section className="calls-filter-panel">
			<input
				type="text"
				placeholder="Site ID"
				value={filters.siteId}
				onChange={(event) =>
					onFiltersChange({
						...filters,
						siteId: event.target.value,
					})
				}
			/>

			<input
				type="date"
				value={filters.loggedFrom}
				onChange={(event) =>
					onFiltersChange({
						...filters,
						loggedFrom: event.target.value,
					})
				}
			/>

			<input
				type="date"
				value={filters.loggedTo}
				onChange={(event) =>
					onFiltersChange({
						...filters,
						loggedTo: event.target.value,
					})
				}
			/>

			<input
				type="text"
				placeholder="System Type"
				value={filters.systemType}
				onChange={(event) =>
					onFiltersChange({
						...filters,
						systemType: event.target.value,
					})
				}
			/>
		</section>
	);
};

export default CallsFilterPanel;