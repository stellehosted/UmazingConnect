"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react"

export function AdminClubImport() {
  const [jsonInput, setJsonInput] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    imported?: number
    errors?: number
    errorDetails?: Array<{ club: string; error: string }>
  } | null>(null)

  const handleImport = async () => {
    try {
      const clubs = JSON.parse(jsonInput)
      
      if (!Array.isArray(clubs)) {
        setResult({
          success: false,
          errorDetails: [{ club: "Input", error: "JSON must be an array of clubs" }],
        })
        return
      }

      setIsImporting(true)
      setResult(null)

      const response = await fetch("/api/clubs/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clubs }),
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          imported: data.imported,
          errors: data.errors,
          errorDetails: data.errorDetails,
        })
        setJsonInput("") // Clear input on success
      } else {
        setResult({
          success: false,
          errorDetails: [{ club: "Import", error: data.error || "Import failed" }],
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        errorDetails: [{ club: "Parse Error", error: error.message }],
      })
    } finally {
      setIsImporting(false)
    }
  }

  const exampleJson = `[
  {
    "name": "Chess Club",
    "description": "Sharpen your strategic thinking! Weekly tournaments, lessons for beginners, and preparation for competitions.",
    "category": "hobby",
    "meetingTime": "Wednesdays, 3:30 PM",
    "location": "Library",
    "imageUrl": "/placeholder.svg?key=chess",
    "tags": ["Strategy", "Competition", "Logic"]
  },
  {
    "name": "Photography Club",
    "description": "Capture the world through your lens! Learn techniques, share your work, and participate in photo walks.",
    "category": "arts",
    "meetingTime": "Thursdays, 3:45 PM",
    "location": "Art Room",
    "imageUrl": "/placeholder.svg?key=photo",
    "tags": ["Visual Arts", "Creative", "Digital"]
  }
]`

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Bulk Import Clubs</CardTitle>
        <CardDescription>
          Import multiple clubs at once using JSON format. Paste your club data below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="json-input">Club Data (JSON Array)</Label>
          <Textarea
            id="json-input"
            placeholder="Paste your club JSON array here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleImport} disabled={!jsonInput.trim() || isImporting}>
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Clubs
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setJsonInput(exampleJson)}
            disabled={isImporting}
          >
            Load Example
          </Button>
        </div>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.success ? (
                <div>
                  <p className="font-semibold">Import Complete!</p>
                  <p>Imported: {result.imported} clubs</p>
                  {result.errors && result.errors > 0 && (
                    <p>Errors: {result.errors} clubs</p>
                  )}
                  {result.errorDetails && result.errorDetails.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Errors:</p>
                      <ul className="list-disc list-inside">
                        {result.errorDetails.map((err, idx) => (
                          <li key={idx}>
                            {err.club}: {err.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-semibold">Import Failed</p>
                  {result.errorDetails && (
                    <ul className="list-disc list-inside mt-2">
                      {result.errorDetails.map((err, idx) => (
                        <li key={idx}>
                          {err.club}: {err.error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-semibold">Expected JSON Format:</p>
          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
            {`[
  {
    "name": "Club Name",
    "description": "Club description",
    "category": "academic | arts | sports | technology | service | hobby",
    "meetingTime": "Optional meeting time",
    "location": "Optional location",
    "imageUrl": "Optional image URL",
    "tags": ["tag1", "tag2"]
  }
]`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

