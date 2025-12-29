import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, DollarSign, Calendar, Plus, Trash2, CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface PaymentMilestone {
    id: string;
    label: string;
    amount: string;
    dueDate: string;
}

interface ContractUploadProps {
    onComplete?: () => void;
    clientName?: string;
    serviceName?: string;
}

export default function ContractUpload({ onComplete, clientName = "Sarah & Mike", serviceName = "Full Day Photography" }: ContractUploadProps) {
    const [finalCost, setFinalCost] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [milestones, setMilestones] = useState<PaymentMilestone[]>([
        { id: "1", label: "Deposit", amount: "", dueDate: "" }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddMilestone = () => {
        setMilestones([...milestones, { id: Math.random().toString(36).substr(2, 9), label: "", amount: "", dueDate: "" }]);
    };

    const handleRemoveMilestone = (id: string) => {
        setMilestones(milestones.filter(m => m.id !== id));
    };

    const handleUpdateMilestone = (id: string, field: keyof PaymentMilestone, value: string) => {
        setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!finalCost || !file) {
            toast.error("Please provide the final cost and upload the signed contract.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Mock submission delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success("Booking finalized!", {
                description: `Contract for ${clientName} has been uploaded and budget updated.`,
                icon: <CheckCircle className="w-5 h-5 text-green-500" />
            });

            if (onComplete) onComplete();
        } catch (error) {
            toast.error("Failed to finalize booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="p-3 bg-green-500/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-white">Marking {clientName} as Booked</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{serviceName}</p>
                </div>
            </div>

            <Card className="border-slate-800 bg-slate-900/50 shadow-none text-white">
                <CardHeader>
                    <CardTitle className="font-serif text-lg">Financial Details</CardTitle>
                    <CardDescription className="text-slate-500">Enter the final agreed price and upload the signed agreement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="final-cost" className="text-slate-400 text-xs uppercase font-bold tracking-widest">Final Agreed Cost</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="final-cost"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-9 bg-slate-900 border-slate-700 text-white"
                                    value={finalCost}
                                    onChange={(e) => setFinalCost(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs uppercase font-bold tracking-widest">Contract (PDF)</Label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${file ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700 hover:border-slate-600 bg-slate-950'}`}
                            >
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center gap-2 text-center">
                                    {file ? (
                                        <>
                                            <FileText className="w-6 h-6 text-green-400" />
                                            <p className="text-xs font-medium text-white max-w-[150px] truncate">{file.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-slate-500" />
                                            <p className="text-[10px] text-slate-400">Click or drag PDF contract</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-400 text-xs uppercase font-bold tracking-widest">Payment Schedule</Label>
                            <Button variant="ghost" size="sm" onClick={handleAddMilestone} className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 h-7 px-2">
                                <Plus className="w-3 h-3 mr-1" /> Add Milestone
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {milestones.map((m, index) => (
                                <div key={m.id} className="flex gap-3 items-end p-3 rounded-lg bg-slate-950 border border-slate-800 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder="e.g. Deposit"
                                            className="h-8 text-xs bg-slate-900 border-none"
                                            value={m.label}
                                            onChange={(e) => handleUpdateMilestone(m.id, "label", e.target.value)}
                                        />
                                    </div>
                                    <div className="w-24 space-y-2">
                                        <div className="relative">
                                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                            <Input
                                                placeholder="0.00"
                                                className="h-8 pl-6 text-xs bg-slate-900 border-none"
                                                value={m.amount}
                                                onChange={(e) => handleUpdateMilestone(m.id, "amount", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <div className="relative">
                                            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                            <Input
                                                type="date"
                                                className="h-8 pl-6 text-[10px] bg-slate-900 border-none"
                                                value={m.dueDate}
                                                onChange={(e) => handleUpdateMilestone(m.id, "dueDate", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-600 hover:text-red-400"
                                        onClick={() => handleRemoveMilestone(m.id)}
                                        disabled={milestones.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-serif py-6 gap-2"
                    >
                        {isSubmitting ? "Processing..." : "Confirm & Finalize Booking"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
