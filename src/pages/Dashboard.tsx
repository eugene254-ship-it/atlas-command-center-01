import { useState } from "react";
import { MissionOverview } from "@/components/dashboard/MissionOverview";
import { KPICards } from "@/components/dashboard/KPICards";
import { MissionPortfolio } from "@/components/dashboard/MissionPortfolio";
import { MilestoneTracker } from "@/components/dashboard/MilestoneTracker";
import { FundingModule } from "@/components/dashboard/FundingModule";
import { CommandAlerts } from "@/components/dashboard/CommandAlerts";
import { PartnersModule } from "@/components/dashboard/PartnersModule";
import { RegionsModule } from "@/components/dashboard/RegionsModule";
import { VerificationModule } from "@/components/dashboard/VerificationModule";
import { BlockersPanel } from "@/components/dashboard/BlockersPanel";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { FilterBar, defaultFilters, type FilterState } from "@/components/dashboard/FilterBar";
import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { AfricaMap } from "@/components/dashboard/AfricaMap";
import { ScenarioForecasting } from "@/components/dashboard/ScenarioForecasting";
import { missions } from "@/lib/mock-data";

type Section = "overview" | "missions" | "milestones" | "funding" | "partners" | "regions" | "verification" | "risks";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [selectedMission, setSelectedMission] = useState(missions[0]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<"executive" | "operator">("operator");

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="pt-[3.5rem]">
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {viewMode === "executive" && activeSection === "overview" ? (
          <ExecutiveSummary missions={missions} />
        ) : (
          <>
            {activeSection === "overview" && (
              <div className="space-y-0">
                <MissionOverview mission={selectedMission} />
                <KPICards mission={selectedMission} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-0">
                  <div className="xl:col-span-2 border-r border-border">
                    <MilestoneTracker missionId={selectedMission.id} />
                    <FundingModule />
                  </div>
                  <div className="border-t xl:border-t-0">
                    <CommandAlerts />
                    <BlockersPanel />
                  </div>
                </div>

                <AfricaMap />
                <ScenarioForecasting />

                <MissionPortfolio
                  missions={missions}
                  selectedId={selectedMission.id}
                  onSelect={(m) => { setSelectedMission(m); setActiveSection("overview"); }}
                />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
                  <div className="border-r border-border">
                    <RegionsModule />
                  </div>
                  <div>
                    <PartnersModule />
                  </div>
                </div>
                <VerificationModule />
              </div>
            )}

            {activeSection === "missions" && (
              <MissionPortfolio
                missions={missions}
                selectedId={selectedMission.id}
                onSelect={(m) => { setSelectedMission(m); setActiveSection("overview"); }}
              />
            )}
            {activeSection === "milestones" && <MilestoneTracker missionId={selectedMission.id} />}
            {activeSection === "funding" && <FundingModule />}
            {activeSection === "partners" && <PartnersModule />}
            {activeSection === "regions" && (
              <div>
                <AfricaMap />
                <RegionsModule />
              </div>
            )}
            {activeSection === "verification" && <VerificationModule />}
            {activeSection === "risks" && (
              <div>
                <BlockersPanel />
                <ScenarioForecasting />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
