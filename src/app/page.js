'use client'
import React, { useEffect, useRef, useState } from "react";
import * as FaceDetection from "@mediapipe/face_detection";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import FacialAnalysisView from "@/components/facial-analysis-view";
import ControlPanel from "@/components/control-panel";
// import annyang from "annyang";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectionResults, setDetectionResults] = useState({
    faceCount: 0,
    emotion: "unknown",
    headPose: "center",
    eyeGaze: "center",
    gender: "unknown",
  })

  useEffect(() => {
    async function setupCamera() {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }

    async function loadModels() {
      const faceDetector = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      });

      faceDetector.setOptions({ model: "short", minDetectionConfidence: 0.5 });
      const ctx = canvasRef.current.getContext("2d");

      setInterval(async () => {
        if (!videoRef.current) return;
        const results = await faceDetector.send({ image: videoRef.current });
        // const landmarks = await faceLandmarker.detect(videoRef.current);

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        // if (results.detections.length > 0) {
        //   results.detections.forEach((face) => {
        //     const bbox = face.boundingBox;
        //     ctx.strokeRect(bbox.xCenter - bbox.width / 2, bbox.yCenter - bbox.height / 2, bbox.width, bbox.height);
        //   });

        //   detectFeatures(landmarks);
        // }
      }, 100);
    }

    setupCamera();
    loadModels();
  }, [])


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
