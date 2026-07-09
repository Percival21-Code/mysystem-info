import type { Site } from "../../data/types/siteTypes";

type SitesTableProps = {
	sites: Site[];
	rowsToShow: number;
	onSiteClick: (site: Site) => void;
};

const SitesTable = ({ sites, rowsToShow, onSiteClick }: SitesTableProps) => {
	const visibleSites = sites.slice(0, rowsToShow);

	return (
		<table className="sites-table">
			<thead>
				<tr>
					<th>Site ID</th>
					<th>Site Name</th>
					<th>Postcode</th>
					<th>Status</th>
				</tr>
			</thead>

			<tbody>
				{visibleSites.map((site) => (
					<tr key={site.siteId} onClick={() => onSiteClick(site)}>
						<td>{site.siteId}</td>
						<td>{site.siteName}</td>
						<td>{site.postCode}</td>
						<td>{(site.status === 'L') ? <p>Live</p> : <p>dead</p>}</td>
					</tr>
				))}

				{visibleSites.length === 0 && (
					<tr>
						<td colSpan={5}>No sites found.</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default SitesTable;