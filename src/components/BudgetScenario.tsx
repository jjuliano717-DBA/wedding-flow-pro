
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

// The full list of user-provided categories with typical ranges
const DEFAULT_CATEGORIES = [
    { name: "Venue", range: [5145, 9749], defaultPct: 0.25, color: "#FF8042" },
    { name: "Catering", range: [2102, 3878], defaultPct: 0.15, color: "#00C49F" },
    { name: "Photographer", range: [1483, 2509], defaultPct: 0.08, color: "#FFBB28" },
    { name: "Videographer", range: [1639, 2664], defaultPct: 0.08, color: "#FFBB28" },
    { name: "Wedding Dress", range: [1526, 1774], defaultPct: 0.05, color: "#8884d8" },
    { name: "Tuxedo/Suit", range: [1526, 1774], defaultPct: 0.05, color: "#8884d8" },
    { name: "Beauty Services", range: [734, 1428], defaultPct: 0.03, color: "#8884d8" },
    { name: "DJ", range: [949, 1389], defaultPct: 0.04, color: "#0088FE" },
    { name: "Band", range: [2556, 5103], defaultPct: 0.08, color: "#0088FE" },
    { name: "Soloist/Ensemble", range: [556, 866], defaultPct: 0.02, color: "#0088FE" },
    { name: "Florist", range: [1265, 2364], defaultPct: 0.08, color: "#00C49F" },
    { name: "Wedding Planner", range: [1581, 2664], defaultPct: 0.10, color: "#FF8042" },
    { name: "Officiant", range: [292, 444], defaultPct: 0.01, color: "#FFBB28" },
    { name: "Cake & Desserts", range: [331, 455], defaultPct: 0.02, color: "#00C49F" },
    { name: "Event Rentals", range: [773, 1843], defaultPct: 0.05, color: "#FF8042" },
    { name: "Invitations & Paper", range: [733, 1156], defaultPct: 0.03, color: "#8884d8" },
    { name: "Transportation", range: [850, 1443], defaultPct: 0.03, color: "#FFBB28" },
    { name: "Favors & Gifts", range: [574, 951], defaultPct: 0.02, color: "#8884d8" },
    { name: "Wedding Rings", range: [1526, 1774], defaultPct: 0.05, color: "#FFBB28" },
    { name: "Jewelry", range: [1490, 3605], defaultPct: 0.04, color: "#8884d8" },
    { name: "Landscaper", range: [1000, 1000], defaultPct: 0.02, color: "#A0A0A0" },
    { name: "Pest Control", range: [500, 500], defaultPct: 0.01, color: "#A0A0A0" },
    { name: "Permits", range: [120, 120], defaultPct: 0.005, color: "#A0A0A0" },
];

export type ScenarioData = {
    totalBudget: number;
    guestCount: number;
    location: string;
    allocations: { [key: string]: number }; // Keyed by category name, value is percentage (0-1)
};

interface BudgetScenarioProps {
    id: string;
    name: string;
    defaultBudget?: number;
    initialData?: ScenarioData;
    onUpdate: (data: ScenarioData) => void;
}

export function BudgetScenario({ id, name, defaultBudget = 30000, initialData, onUpdate }: BudgetScenarioProps) {
    const [totalBudget, setTotalBudget] = useState(initialData?.totalBudget || defaultBudget);
    const [guestCount, setGuestCount] = useState(initialData?.guestCount || 100);
    const [location, setLocation] = useState(initialData?.location || "");
    const [allocations, setAllocations] = useState<{ [key: string]: number }>(
        initialData?.allocations ||
        DEFAULT_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.defaultPct }), {})
    );

    // Normalize allocations to always sum to ~100% (simplified logic for now)
    // Real-world: Should probably allow drift or lock specific categories. Used simple independent sliders here.

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        onUpdate({ totalBudget, guestCount, location, allocations });
    }, [totalBudget, guestCount, location, allocations]);

    const handleSliderChange = (category: string, value: number) => {
        setAllocations(prev => ({ ...prev, [category]: value / 100 }));
    };

    const handleAmountChange = (category: string, amount: number) => {
        const pct = amount / totalBudget;
        setAllocations(prev => ({ ...prev, [category]: pct }));
    };

    // Prepare Chart Data (Filter top items for cleaner chart)
    const chartData = DEFAULT_CATEGORIES.map(cat => ({
        name: cat.name,
        value: Math.round(allocations[cat.name] * totalBudget),
        color: cat.color
    })).sort((a, b) => b.value - a.value).filter(i => i.value > 0);

    const totalCalculated = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const costPerGuest = totalCalculated / guestCount;

    return (
        <Card className="h-full flex flex-col border-t-4 border-t-rose-400 shadow-md">
            <CardHeader className="bg-slate-50/50 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle>{name}</CardTitle>
                    <span className="text-sm font-medium text-muted-foreground bg-white px-2 py-1 rounded border">
                        ${Math.round(costPerGuest).toLocaleString()}/guest
                    </span>
                </div>
                <CardDescription>Plan your spending for this scenario.</CardDescription>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-2">
                        <Label htmlFor={`budget-${id}`}>Total Budget</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                            <Input
                                id={`budget-${id}`}
                                type="number"
                                value={totalBudget}
                                onChange={e => setTotalBudget(Number(e.target.value))}
                                className="pl-6 font-bold text-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor={`guests-${id}`}>Guests</Label>
                        <Input
                            id={`guests-${id}`}
                            type="number"
                            value={guestCount}
                            onChange={e => setGuestCount(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor={`location-${id}`}>Location</Label>
                        <Input
                            id={`location-${id}`}
                            type="text"
                            placeholder="e.g. Miami"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pt-6 overflow-hidden flex flex-col">
                {/* Chart Section */}
                <div className="h-[250px] w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Metrics Summary */}
                <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">Allocated</p>
                    <p className={`text-2xl font-bold ${totalCalculated > totalBudget ? 'text-red-500' : 'text-green-600'}`}>
                        ${totalCalculated.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                            of ${totalBudget.toLocaleString()}
                        </span>
                    </p>
                </div>

                {/* Categories List */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {DEFAULT_CATEGORIES.map((cat, idx) => {
                        const currentAmount = Math.round(allocations[cat.name] * totalBudget);
                        const currentPct = (allocations[cat.name] * 100).toFixed(1);

                        // Only show top 5 initially, then all if expanded
                        if (!expanded && idx > 4) return null;

                        return (
                            <div key={cat.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <Label className="text-base">{cat.name}</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Range: ${cat.range[0].toLocaleString()} - ${cat.range[1].toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right w-24">
                                        <Input
                                            className="h-8 text-right font-medium"
                                            value={currentAmount}
                                            onChange={e => handleAmountChange(cat.name, Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Slider
                                        value={[allocations[cat.name] * 100]}
                                        max={50}
                                        step={0.5}
                                        onValueChange={([val]) => handleSliderChange(cat.name, val)}
                                        className="flex-1"
                                    />
                                    <span className="text-xs w-10 text-right text-muted-foreground">{currentPct}%</span>
                                </div>
                            </div>
                        );
                    })}

                    <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setExpanded(!expanded)}>
                        {expanded ? (
                            <><ChevronUp className="w-4 h-4 mr-2" /> Show Less</>
                        ) : (
                            <><ChevronDown className="w-4 h-4 mr-2" /> Show All Categories ({DEFAULT_CATEGORIES.length})</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
