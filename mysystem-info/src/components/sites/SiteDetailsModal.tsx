import type { Site } from '../../data/types/siteTypes';

const SiteDetailsModal = (site: Site) => {
    return <h1>{site.siteId}</h1>;
}

export default SiteDetailsModal;