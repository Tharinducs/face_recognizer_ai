'use client'
import React, { useState } from "react";
import FacialAnalysisView from "@/components/FacialAnalysisView";
import ControlPanel from "@/components/ControlPanel";

const Home = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectionResults, setDetectionResults] = useState({
    faceCount: 0,
    emotion: "unknown",
    headPose: "center",
    eyeGaze: "center",
    gender: "unknown",
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">Advanced Facial Analysis</h1>
        <div className="w-full p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1">
              <FacialAnalysisView isAnalyzing={isAnalyzing} setDetectionResults={setDetectionResults} />
            </div>
            <div className="w-full md:w-64 flex flex-col gap-4">
              <ControlPanel
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
                detectionResults={detectionResults}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
