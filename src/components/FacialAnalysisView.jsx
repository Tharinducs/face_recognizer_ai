"use client"

import { useRef, useEffect, useState } from "react"
import {
    FaceDetector,
    FilesetResolver,
    FaceLandmarker,
} from "@mediapipe/tasks-vision"

const FacialAnalysisView = ({ isAnalyzing, setDetectionResults }) => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [faceDetector, setFaceDetector] = useState(null)
    const [faceLandmarker, setFaceLandmarker] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        async function loadModels() {
            try {
                setIsLoading(true)

                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                )

                // Initialize face detector
                const faceDetectorInstance = await FaceDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    minDetectionConfidence: 0.5,
                })

                // Initialize face landmarker for more detailed analysis
                const faceLandmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    minFaceDetectionConfidence: 0.5,
                    minFacePresenceConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                    outputFaceBlendshapes: true,
                    outputFacialTransformationMatrixes: true,
                })

                setFaceDetector(faceDetectorInstance)
                setFaceLandmarker(faceLandmarkerInstance)
                setIsLoading(false)
            } catch (error) {
                console.error("Error loading MediaPipe models:", error)
                setErrorMessage("Failed to load facial analysis models. Please refresh and try again.")
                setIsLoading(false)
            }
        }

        loadModels()

        return () => {
            // Clean up resources
            if (faceDetector) {
                faceDetector.close()
            }
            if (faceLandmarker) {
                faceLandmarker.close()
            }
        }
    }, [])

    // Set up webcam
    useEffect(() => {
        if (!videoRef.current) return

        async function setupCamera() {
            try {
                const constraints = {
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: "user",
                    },
                }

                const stream = await navigator.mediaDevices.getUserMedia(constraints)
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (error) {
                console.error("Error accessing webcam:", error)
                setErrorMessage("Unable to access your camera. Please check permissions and try again.")
            }
        }

        setupCamera()

        return () => {
            // Clean up video stream
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [videoRef])

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <p>Loading facial analysis models...</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <div className="text-center p-4">
                        <p className="text-red-400 font-bold">Error</p>
                        <p>{errorMessage}</p>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                className={`w-full h-full object-cover ${!isAnalyzing ? "visible" : "hidden"}`}
                autoPlay
                playsInline
                muted
            />

            <canvas ref={canvasRef} className={`w-full h-full object-cover ${isAnalyzing ? "visible" : "hidden"}`} />

        </div>
    )
}

export default FacialAnalysisView