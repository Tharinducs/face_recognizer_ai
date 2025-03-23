"use client"
import useSpeechRecognition from "@/hooks/use-speech-recognition"
import { Mic, MicOff, Play, Pause, User, SmilePlus, Compass, Eye } from "lucide-react"
import { Button, Badge } from "antd"

const ControlPanel = ({ isAnalyzing, setIsAnalyzing, detectionResults }) => {
  const { listening, toggleListening } = useSpeechRecognition({
    onCommand: (command) => {
      if (command.includes("start") || command.includes("begin")) {
        setIsAnalyzing(true)
      } else if (command.includes("stop") || command.includes("pause")) {
        setIsAnalyzing(false)
      }
    },
  })

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "happy":
        return "bg-green-500"
      case "sad":
        return "bg-blue-500"
      case "surprised":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getHeadPoseIcon = (pose) => {
    switch (pose) {
      case "left":
        return "←"
      case "right":
        return "→"
      default:
        return "↕"
    }
  }

  const getEyeGazeIcon = (gaze) => {
    switch (gaze) {
      case "up":
        return "↑"
      case "down":
        return "↓"
      default:
        return "↕"
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Controls</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm">Analysis</span>
          <Button
            icon={isAnalyzing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            className="text-white px-4 py-2"
            danger={isAnalyzing}
            type="primary"
            size="middle"
            variant="solid"
            onClick={() => setIsAnalyzing(!isAnalyzing)}
          >
            {isAnalyzing ? "Stop" : "Start"}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Voice Control</span>
          <Button
            icon={listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            className="text-white px-4 py-2"
            danger={listening}
            disabled={listening}
            size="middle"
            variant={listening ? "solid" : "outlined"}
            onClick={toggleListening}
          >
            {isAnalyzing ? "Stop" : "Start"}
          </Button>
        </div>
      </div>
      <div className="flex-1 mt-4">
        <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">Faces</span>
            </div>
            <Badge>
              <Button shape="round" className="px-4 py-2 border border-gray-300">
                <span className="font-mono">{detectionResults.faceCount}</span>
              </Button>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SmilePlus className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">Emotion</span>
            </div>
            <Badge>
              <Button shape="round" className={`capitalize px-4 py-2 border border-gray-300 ${getEmotionColor(detectionResults.emotion)}`}>
                <span className="font-mono">{detectionResults.emotion}</span>
              </Button>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Compass className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">Head Pose</span>
            </div>
             <Badge>
              <Button shape="round" className={`capitalize px-4 py-2 border border-gray-300 ${getEmotionColor(detectionResults.emotion)}`}>
                <span className="font-mono">{getHeadPoseIcon(detectionResults.headPose)} {detectionResults.headPose}</span>
              </Button>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">Eye Gaze</span>
            </div>
             <Badge>
              <Button shape="round" className={`capitalize px-4 py-2 border border-gray-300 ${getEmotionColor(detectionResults.emotion)}`}>
                <span className="font-mono">{getEyeGazeIcon(detectionResults.eyeGaze)} {detectionResults.eyeGaze}</span>
              </Button>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm">Gender</span>
            </div>
            <Badge>
              <Button shape="round" className={`capitalize px-4 py-2 border border-gray-300 ${getEmotionColor(detectionResults.emotion)}`}>
                <span className="font-mono">{detectionResults.gender}</span>
              </Button>
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-xs text-gray-500">
          <p>Voice commands:</p>
          <p>"Start analysis" / "Stop analysis"</p>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel