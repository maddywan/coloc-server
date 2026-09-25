import { LoaderCircle, Mic } from "lucide-react";
import { useRef, useState } from "react";

function VoiceButton({ context, onFinished }) {
    const [listening, setListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const recognitionRef = useRef(null);

    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
        alert("La reconnaissance vocale n'est pas supportée par ce navigateur.");
        return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "fr-FR";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true);
            setProcessing(false);
        };

        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            setProcessing(true);

            const response = await fetch(`/airequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                }),
            });

            const result = await response.json();
            console.log(result);

            setProcessing(false);
            setListening(false);
            recognition.stop();
            onFinished();
        };

        recognition.onerror = (event) => {
            if (event.error === "not-allowed") window.alert("L'utilisation du micro n'est pas autorisée.");
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognitionRef.current = recognition;

        recognition.start();
  };

  /*const startRecognitionW = async() => {
    setListening(true);
    setProcessing(false);
    const text = window.prompt("Commande :");
    setProcessing(true);

    const response = await fetch(`/airequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: text,
        }),
    });

    const result = await response.json();

    setProcessing(false);
    setListening(false);
    onFinished();
  }*/

  return (
    <>
        <button onClick={startRecognition}
            className={`voice-button ${
                    listening ? "listening" : ""
                } ${processing ? "processing" : ""}`}
                disabled={processing}
        >
            {processing ? (
                <LoaderCircle className="voice-icon spinning" />
            ) : listening ? (
                <Mic className="voice-icon" />
            ) : (
                <Mic className="voice-icon" />
            )}
        </button>
    </>
  );
}

export default VoiceButton;