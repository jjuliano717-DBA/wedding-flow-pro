/**
 * Google Business Importer Component
 * 
 * Allows venue owners to import their business data from Google Business Profile
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { fetchPlaceData } from '@/lib/services/google-places';
import type { VenueData } from '@/lib/utils/google-places';

interface GoogleBusinessImporterProps {
    onImport: (data: Partial<VenueData>) => void;
    onSkip?: () => void;
    className?: string;
    currentUrl?: string;
}

export function GoogleBusinessImporter({ onImport, onSkip, className, currentUrl = '' }: GoogleBusinessImporterProps) {
    const [url, setUrl] = useState(currentUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<Partial<VenueData> | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleImportClick = async () => {
        if (!url.trim()) {
            setError('Please enter a Google Business URL or Place ID');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPreviewData(null);

        try {
            const data = await fetchPlaceData(url);

            if (data) {
                setPreviewData(data);
                setShowPreview(true);
            } else {
                setError('No data found for this business');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to import business data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (previewData) {
            onImport(previewData);
            setShowPreview(false);
            setPreviewData(null);
        }
    };

    const handleCancel = () => {
        setShowPreview(false);
        setPreviewData(null);
    };

    return (
        <Card className={`border-blue-200 bg-blue-50/50 ${className || ''}`}>
            <CardHeader>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-lg">Import from Google Business</CardTitle>
                        <CardDescription>
                            Auto-fill your profile using your Google Business listing
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Info Alert */}
                <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-slate-700">
                        Paste your Google Business URL (e.g., https://g.page/your-business) or Place ID
                    </AlertDescription>
                </Alert>

                {/* URL Input */}
                {!showPreview && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="google-url">Google Business URL or Place ID</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="google-url"
                                    placeholder="https://g.page/your-business or ChIJ..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleImportClick}
                                    disabled={isLoading || !url.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Import
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Supported URL Formats */}
                        <div className="text-xs text-slate-500 space-y-1">
                            <p className="font-medium">Supported formats:</p>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                                <li>https://g.page/business-name</li>
                                <li>https://maps.google.com/?cid=123456789</li>
                                <li>https://www.google.com/maps/place/...</li>
                                <li>Direct Place ID (ChIJ...)</li>
                            </ul>
                        </div>

                        {onSkip && (
                            <div className="pt-2 border-t">
                                <Button
                                    variant="ghost"
                                    onClick={onSkip}
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    Skip and enter manually
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Preview Data */}
                {showPreview && previewData && (
                    <div className="space-y-4">
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-sm text-slate-700">
                                Data imported successfully! Review and apply to your profile.
                            </AlertDescription>
                        </Alert>

                        <div className="bg-white border rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold text-sm text-slate-700">Preview</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {previewData.business_name && (
                                    <div>
                                        <span className="text-slate-500">Business Name:</span>
                                        <p className="font-medium">{previewData.business_name}</p>
                                    </div>
                                )}
                                {previewData.location && (
                                    <div>
                                        <span className="text-slate-500">Location:</span>
                                        <p className="font-medium">{previewData.location}</p>
                                    </div>
                                )}
                                {previewData.street_address && (
                                    <div className="col-span-2">
                                        <span className="text-slate-500">Address:</span>
                                        <p className="font-medium">{previewData.street_address}</p>
                                    </div>
                                )}
                                {previewData.contact_phone && (
                                    <div>
                                        <span className="text-slate-500">Phone:</span>
                                        <p className="font-medium">{previewData.contact_phone}</p>
                                    </div>
                                )}
                                {previewData.website && (
                                    <div>
                                        <span className="text-slate-500">Website:</span>
                                        <p className="font-medium truncate">{previewData.website}</p>
                                    </div>
                                )}
                                {(previewData.google_rating !== undefined && previewData.google_rating > 0) && (
                                    <div>
                                        <span className="text-slate-500">Rating:</span>
                                        <p className="font-medium">
                                            ⭐ {previewData.google_rating} ({previewData.google_reviews} reviews)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleApply}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Apply to Profile
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Development Note */}
                <Alert className="bg-amber-50 border-amber-200">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-xs text-slate-700">
                        <strong>Note:</strong> Currently using mock data for development.
                        To enable real Google Places API integration, add your API key to the backend service.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
