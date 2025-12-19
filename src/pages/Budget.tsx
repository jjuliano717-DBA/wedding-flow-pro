
import { useState } from "react";
import { BudgetScenario, ScenarioData } from "@/components/BudgetScenario";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft, TrendingDown, TrendingUp, MapPin, Layers } from "lucide-react";

export default function Budget() {
    const [scenarioA, setScenarioA] = useState<ScenarioData | null>(null);
    const [scenarioB, setScenarioB] = useState<ScenarioData | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false);

    const getScenarioTotal = (data: ScenarioData | null) => {
        if (!data) return 0;
        return Object.keys(data.allocations).reduce((acc, key) => {
            return acc + (data.allocations[key] * data.totalBudget);
        }, 0);
    };

    const totalA = getScenarioTotal(scenarioA);
    const totalB = getScenarioTotal(scenarioB);
    const diff = totalB - totalA;
    const isBCheaper = diff < 0;

    const handleEnableComparison = () => {
        setShowComparison(true);
        setHasAnsweredQuestion(true);
    };

    const handleDisableComparison = () => {
        setShowComparison(false);
        setHasAnsweredQuestion(true);
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-serif font-bold mb-4">Budget Advisor</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Smart allocation logic and scenario planning for your big day.
                </p>
            </div>

            {/* Comparison Logic Question */}
            {!hasAnsweredQuestion && (
                <Card className="max-w-2xl mx-auto mb-10 border-rose-100 bg-rose-50/50">
                    <CardContent className="pt-6 text-center">
                        <h3 className="text-lg font-semibold mb-2">Planning a destination wedding or comparing venues?</h3>
                        <p className="text-muted-foreground mb-6">
                            Do you want to add two Budget Scenarios based on different wedding locations and experiences?
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={handleDisableComparison} className="w-32">
                                No, just one
                            </Button>
                            <Button variant="champagne" onClick={handleEnableComparison} className="w-32">
                                Yes, Compare
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Control Bar (Visible after answering) */}
            {hasAnsweredQuestion && (
                <div className="flex justify-center items-center gap-4 mb-8">
                    <div className="flex items-center space-x-2 bg-white p-3 rounded-full border shadow-sm">
                        <Switch id="compare-mode" checked={showComparison} onCheckedChange={setShowComparison} />
                        <Label htmlFor="compare-mode" className="font-medium cursor-pointer flex items-center gap-2">
                            <Layers className="w-4 h-4 text-rose-500" />
                            Compare Scenarios
                        </Label>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {showComparison ? (
                <>
                    {/* Mobile View: Tabs */}
                    <div className="md:hidden">
                        <Tabs defaultValue="scenario-a" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="scenario-a">Scenario A</TabsTrigger>
                                <TabsTrigger value="scenario-b">Scenario B</TabsTrigger>
                            </TabsList>
                            <TabsContent value="scenario-a">
                                <BudgetScenario
                                    id="scen-a"
                                    name="Scenario A (Primary)"
                                    defaultBudget={30000}
                                    onUpdate={setScenarioA}
                                />
                            </TabsContent>
                            <TabsContent value="scenario-b">
                                <BudgetScenario
                                    id="scen-b"
                                    name="Scenario B (Alternative)"
                                    defaultBudget={25000}
                                    onUpdate={setScenarioB}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Desktop View: Side-by-Side */}
                    <div className="hidden md:grid md:grid-cols-2 gap-8 relative">
                        {/* Floating VS Badge */}
                        <div className="absolute left-1/2 top-20 -translate-x-1/2 z-10 bg-white p-2 rounded-full shadow-lg border">
                            <div className="bg-slate-900 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">VS</div>
                        </div>

                        <BudgetScenario
                            id="scen-a-desktop"
                            name="Scenario A (Primary)"
                            defaultBudget={30000}
                            onUpdate={setScenarioA}
                        />

                        <BudgetScenario
                            id="scen-b-desktop"
                            name="Scenario B (Alternative)"
                            defaultBudget={25000}
                            onUpdate={setScenarioB}
                        />
                    </div>
                </>
            ) : (
                /* Single View */
                <div className="max-w-2xl mx-auto">
                    <BudgetScenario
                        id="scen-single"
                        name="Primary Budget"
                        defaultBudget={30000}
                        onUpdate={setScenarioA}
                    />
                </div>
            )}

            {/* Sticky Comparison Bar (Only in Comparison Mode) */}
            {showComparison && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl z-40">
                    <div className="container mx-auto max-w-4xl flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Difference</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold ${isBCheaper ? 'text-green-600' : 'text-red-500'}`}>
                                    {isBCheaper ? '-' : '+'}${Math.abs(diff).toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {isBCheaper ? 'Scenario B is cheaper' : 'Scenario B is more expensive'}
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:flex gap-8">
                            <div>
                                <span className="text-xs text-muted-foreground block">Scenario A Total</span>
                                <span className="font-semibold">${Math.round(totalA).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground block">Scenario B Total</span>
                                <span className="font-semibold">${Math.round(totalB).toLocaleString()}</span>
                            </div>
                        </div>

                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            <ArrowRightLeft className="w-4 h-4 mr-2" />
                            Save Comparison
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
