import { NavLink } from "react-router-dom";
import { useAuth } from "../data/auth/useAuth";

const SideBar = () => {
    const { user } = useAuth();

    const canAccessAdmin = user?.roles.includes("Administrator") || user?.roles.includes("Staff");

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>mysystem.info</h2>
                <p>By The Kirby Group&copy;</p>
            </div>

            <div className="sidebar-nav">
                <ul>
                    <li>
						<NavLink to="/app/dashboard">Dashboard</NavLink>
					</li>
					<li>
						<NavLink to="/app/sites">Sites</NavLink>
					</li>
					<li>
						<NavLink to="/app/calls">Calls</NavLink>
					</li>
					<li>
						<NavLink to="/app/settings">Settings</NavLink>
					</li>

					{canAccessAdmin && (
						<li>
							<NavLink to="/app/administration">
								Administration
							</NavLink>
						</li>
					)}
                </ul>
            </div>
        </div>
    )
}

export default SideBar;