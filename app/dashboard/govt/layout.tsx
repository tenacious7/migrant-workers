"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Activity, AlertTriangle, User, MapPin, TrendingUp, Settings, Download, Bell, LogOut, Menu, FileText } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export default function GovtDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // --- Configuration ---
  const menuItems = [
    {
      id: "population-overview",
      label: "Population Overview",
      icon: Users,
      path: "/dashboard/govt",
      badge: { text: "Active", color: "bg-green-600 text-white" },
    },
    {
      id: "disease-surveillance",
      label: "Disease Surveillance",
      icon: Activity,
      path: "/dashboard/govt/disease-surveillance",
      badge: { text: "12", color: "bg-red-500 text-white text-xs" },
    },
    {
      id: "high-risk-camps",
      label: "High-Risk Camps",
      icon: AlertTriangle,
      path: "/dashboard/govt/high-risk-camps",
      badge: { text: "8", color: "bg-yellow-500 text-white text-xs" },
    },
    {
      id: "health-records",
      label: "Health Records",
      icon: User,
      path: "/dashboard/govt/health-records",
    },
    {
      id: "emergency-response",
      label: "Emergency Response",
      icon: AlertTriangle,
      path: "/dashboard/govt/emergency-response",
      badge: { text: "LIVE", color: "bg-red-600 text-white text-xs" },
    },
  ]

  type Action = "Export Report" | "Generate Report" | "PDF" | "Excel"

  const headerConfig: Record<string, { title: string; subtitle: string; actions: Action[] }> = {
    "/dashboard/govt": {
      title: "Migrant Population Overview",
      subtitle: "Real-time health monitoring across Kerala migrant camps",
      actions: ["Export Report"],
    },
    "/dashboard/govt/disease-surveillance": {
      title: "Disease Surveillance Dashboard",
      subtitle: "Real-time monitoring and analysis of disease patterns",
      actions: ["Export Report"],
    },
    "/dashboard/govt/high-risk-camps": {
      title: "High-Risk Camp Monitoring",
      subtitle: "Monitor migrant camps with active health risks. Quickly identify and act on outbreaks.",
      actions: ["Export Report", "Generate Report"],
    },
    "/dashboard/govt/health-records": {
      title: "Migrant Health Registry",
      subtitle: "Anonymous Health Records Management",
      actions: ["Export Report", "Generate Report"],
    },
    "/dashboard/govt/emergency-response": {
      title: "Emergency Response",
      subtitle: "Real-time outbreak alerts, hotspot monitoring, and action tracking",
      actions: ["PDF", "Excel"],
    },
  }

  const currentConfig = headerConfig[pathname] || headerConfig["/dashboard/govt"]

  const handleLogout = () => {
    router.push("/")
  }

  const isActive = (path: string) => {
    if (path === "/dashboard/govt") return pathname === "/dashboard/govt"
    return pathname?.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="govt-sidebar hidden md:flex w-60 bg-white border-r border-gray-200 p-4 flex-col flex-shrink-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            KHM
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-none">Kerala Health</div>
            <div className="text-xs text-gray-500 mt-1">Migrant Monitor</div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
          />
        </div>

        {/* Navigation - Scrollable inside sidebar if needed */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path) 
                  ? "bg-green-50 text-green-700 shadow-sm ring-1 ring-green-100" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && <Badge className={`${item.badge.color} text-[10px] h-5 px-1.5`}>{item.badge.text}</Badge>}
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. Rajesh Kumar</p>
              <p className="text-xs text-gray-500 truncate">Health Officer</p>
            </div>
            <Settings className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>
      </aside>


      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header (Visible only on Mobile) */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawerOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-md">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <span className="font-semibold text-gray-900">Govt Dashboard</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Desktop Header (Sticky at top of content area) */}
        <header className="hidden md:flex h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{currentPageConfig.title}</h1>
            <p className="text-xs text-gray-500">{currentPageConfig.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-700">System Live</span>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            {currentPageConfig.actions.map((action, index) => (
              <button
                key={index}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  action.variant === 'outline' 
                    ? 'border border-gray-200 text-gray-700 hover:bg-gray-50' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                <action.icon className="h-3.5 w-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        </header>

        {/* Scrollable Page Content */}
        {/* flex-1 makes it take remaining height, overflow-y-auto enables scrolling ONLY here */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Mobile Navigation Drawer */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Mobile Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        router.push(item.path)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                    >
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Header - Only visible on mobile */}
        <header className="flex h-14 md:hidden items-center gap-2 border-b px-4 bg-white shadow-sm">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">{currentConfig.title}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="px-2">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900">{currentConfig.title}</h1>
              <p className="text-sm text-gray-600">{currentConfig.subtitle}</p>
            </div>
          </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
              {currentConfig.actions.includes("Export Report") && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-1" />
                  Export Report
                </Button>
              )}
              {currentConfig.actions.includes("Generate Report") && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-1" />
                  Generate Report
                </Button>
              )}
              {currentConfig.actions.includes("PDF") && (
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              )}
              {currentConfig.actions.includes("Excel") && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Excel
                </Button>
              )}
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              </div>
              <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  )
}