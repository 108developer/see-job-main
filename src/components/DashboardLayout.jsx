"use client"; // Ensure this component runs in the client
import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Bell, MessageCircle } from "lucide-react";
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children, currentUrl }) => {
    // Split the current URL into segments
    const pathSegments = currentUrl.split("/").filter(Boolean); // Split and filter empty segments

    // Generate breadcrumb items based on path segments
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`; // Construct href for each segment
        return (
            <BreadcrumbItem key={index}>
                <BreadcrumbLink href={href}>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)} {/* Capitalize first letter */}
                </BreadcrumbLink>
            </BreadcrumbItem>
        );
    });

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center w-full justify-between gap-2 px-3">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbItems.length > 0 ? (
                                        <>
                                            {breadcrumbItems.map((item, index) => (
                                                <div className='flex items-center' key={index}>
                                                    {item}
                                                    {index < breadcrumbItems.length - 1 && (
                                                        <BreadcrumbSeparator className="hidden md:block" />
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Home</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center px-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost">
                                        <Bell className="size-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit">Open popover</PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost">
                                        <MessageCircle className="size-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-fit">Open popover</PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
