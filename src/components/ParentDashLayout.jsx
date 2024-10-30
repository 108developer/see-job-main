"use client"; // Ensure this component runs in the client

import { usePathname } from 'next/navigation'; // Hook to get current pathname
import DashboardLayout from './DashboardLayout';

const ParentComponent = ({ children }) => {
    const currentUrl = usePathname(); // Get the current pathname

    return (
        <DashboardLayout currentUrl={currentUrl}>
            {children} {/* Render the child content here */}
        </DashboardLayout>
    );
};

export default ParentComponent;
