"use client"
import { useState, useEffect, useCallback,useRef } from "react"

const useSpeechRecognition = ({ onCommand }) => {
    const [transcript, setTranscript] = useState("")
    const [listening, setListening] = useState(false)
    const recognitionRef = useRef(null) // Store recognition instance

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check if browser supports speech recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

            if (!SpeechRecognition) {
                console.error("Speech recognition not supported in this browser")
                return
            }

            if (!recognitionRef.current) {
                const recognitionInstance = new SpeechRecognition()
                recognitionInstance.continuous = true
                recognitionInstance.interimResults = true
                recognitionInstance.lang = "en-US"

                // Handle recognition results
                recognitionInstance.onresult = (event) => {
                    let finalTranscript = ""
                    let interimTranscript = ""

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript

                        if (event.results[i].isFinal) {
                            finalTranscript += transcript

                            // Process command if callback provided
                            if (onCommand && finalTranscript.trim() !== "") {
                                onCommand(finalTranscript.toLowerCase())
                            }
                        } else {
                            interimTranscript += transcript
                        }
                    }

                    setTranscript(finalTranscript || interimTranscript)
                }

                // Handle recognition end
                recognitionInstance.onend = () => {
                    if (listening) {
                        // Restart if it was supposed to be listening
                        recognitionInstance.start()
                    } else {
                        setListening(false)
                    }
                }

                // Handle recognition errors
                recognitionInstance.onerror = (event) => {
                    console.error("Speech recognition error", event.error)
                    if (event.error === "not-allowed") {
                        setListening(false)
                    }
                }

                recognitionRef.current = recognitionInstance
            }
        }


        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort()
            }
        }
    }, [onCommand])

    // Toggle listening state
    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return

        if (listening) {
            recognitionRef.current.stop()
            setListening(false)
        } else {
            try {
                recognitionRef.current.start()
                setListening(true)
            } catch (error) {
                console.error("Error starting speech recognition:", error)
            }
        }
    }, [listening])

    // Reset transcript
    const resetTranscript = useCallback(() => {
        setTranscript("")
    }, [])

    return {
        transcript,
        listening,
        toggleListening,
        resetTranscript,
    }
}

export default useSpeechRecognition;

