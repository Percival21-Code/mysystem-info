import type { Call } from "../../data/types/callTypes";
import "../../styles/app-styles/CallsTable.css";

type CallsTableProps = {
	calls: Call[];
	rowsToShow: number;
	isLoading?: boolean;
	onCallClick: (call: Call) => void;
};

const CallsTable = ({
	calls,
	rowsToShow,
	isLoading = false,
	onCallClick,
}: CallsTableProps) => {
	const visibleCalls = calls.slice(0, rowsToShow);
	const skeletonRows = Array.from({
		length: Math.min(rowsToShow, 8),
	});

	return (
		<table className="calls-table">
			<thead>
				<tr>
					<th>Call Number</th>
					<th>Site ID</th>
					<th>Type</th>
					<th>Status</th>
					<th>Logged</th>
					<th>Engineer</th>
				</tr>
			</thead>

			<tbody>
				{isLoading &&
					skeletonRows.map((_, index) => (
						<tr 
							key={`call-skeleton-${index}`}
							className="calls-skeleton-row"	
						>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
							<td>
								<span className="skeleton-block" />
							</td>
						</tr>
					))}

				{!isLoading &&
					visibleCalls.map((call) => (
						<tr key={call.callNumber}>
							<td>
								<button
									type="button"
									className="call-number-button"
									onClick={() =>
										onCallClick(call)
									}
								>
									{call.callNumber}
								</button>
							</td>

							<td>{call.siteId}</td>
							<td>{call.callType || "—"}</td>
							<td>{call.callStatus || "—"}</td>
							<td>{call.loggedDate || "—"}</td>
							<td>{call.engineer || "—"}</td>
						</tr>
					))}

				{!isLoading && visibleCalls.length === 0 && (
					<tr>
						<td
							colSpan={6}
							className="calls-empty-row"
						>
							No calls found.
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default CallsTable;