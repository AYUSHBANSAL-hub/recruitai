"use client";

import type React from "react";
import { useState, useEffect, useId } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Save, X, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import { quillFormats, quillModules } from "@/app/admin/forms/create/page";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface EditJobDescriptionModalProps {
  initialContent?: string;
  onSave: (content: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

function EditJobDescriptionModal({
  initialContent = "",
  onSave,
  open,
  onOpenChange,
  trigger,
}: EditJobDescriptionModalProps) {
  const [content, setContent] = useState(initialContent);
  const [isGeneratingJobDescription, setIsGeneratingJobDescription] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  const [authToken, setAuthToken] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="));

      setAuthToken(cookie ? cookie.split("=")[1] : ""); // Fallback to empty string
    }
  }, []);

  // Update content when initialContent changes
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(content);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving job description:", error);
      setError("Failed to save job description. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const jobDescriptionAI = async () => {
    if (!content) {
      setError("Please enter a job description first");
      return;
    }
    try {
      const newContent = prompt + content;
      setIsGeneratingJobDescription(true);
      setError(""); // Clear any previous errors
      
      const response = await fetch("/api/generate-job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          jobDescription: newContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate fields");
      }

      const data = await response.json();
      setContent(data.jobDescriptionAI);
      setPrompt("");
    } catch (err) {
      console.error("Error generating job description:", err);
      setError(
        "Failed to generate job description. Please try again or add fields manually."
      );
    } finally {
      setIsGeneratingJobDescription(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-6xl p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Edit Job Description
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* AI Button */}
        <div className="space-y-2 min-w-[300px] px-6 py-2">
          <Label htmlFor={id}>
            {" "}
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 mr-2 text-indigo-500" /> Rewrite with
              AI
            </div>
          </Label>
          <div className="relative">
            <Input
              id={id}
              className="pe-9"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              type="text"
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Subscribe"
              onClick={jobDescriptionAI}
              disabled={prompt.length == 0}
            >
              {isGeneratingJobDescription ? (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              ) : (
                <Send
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-indigo-500"
                />
              )}
            </button>
          </div>
        </div>

        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 pt-2">
          {/* Editor on the left */}
          <div className="w-full">
            <h3 className="text-sm font-medium mb-2">Editor</h3>
            <Card className="border rounded-md h-[400px] overflow-hidden">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={(value) => setContent(value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="h-[370px] bg-white"
              />
            </Card>
          </div>

          {/* Preview on the right */}
          <div className="w-full">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <Card className="border rounded-md p-4 h-[400px] overflow-auto">
              <div className="prose prose-indigo max-w-none">
                {content ? (
                  <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    Job description will appear here...
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Buttons at the bottom */}
        <div className="flex justify-end gap-2 p-6 pt-4 border-t mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditJobDescriptionModal;
