import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DeveloperListPage(props: any) {
    const navigate = useNavigate();

    return (
        // <SideNavLayout sidebarData={sidebarData} />
        <p className="mt-2 p-4">
            DeveloperListPage
        </p>
    );
}
