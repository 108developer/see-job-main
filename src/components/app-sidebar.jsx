import * as React from "react"
import { BookDashed, GalleryVerticalEnd, LayoutDashboard, LucidePodcast, PanelTopDashed, PodcastIcon, SearchCheck, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      items: [
        {
          title: "Home",
          icon: <LayoutDashboard />,
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Job Post Data",
      items: [
        {
          title: "Job Posts",
          icon: <PodcastIcon />,
          url: "/dashboard/JobPosts",
        },
        {
          title: "Today's Job Post",
          url: "/dashboard/JobPost/now",
          icon: <LucidePodcast />,
        }
      ],
    },
    {
      title: "Job Seeker Data",
      items: [
        {
          title: "Total Jobseekers",
          icon: <SearchCheck />,
          url: "/dashboard/Seekers",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Username</span>
                  <span className="">role</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="flex font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <div className="">
                            {item.icon}
                            <a href={item.url}>{item.title}</a>
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>)
  );
}
