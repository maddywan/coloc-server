import { LoaderCircle, Mic } from "lucide-react";
import { useRef, useState } from "react";

function VoiceButton({ onFinished }) {
    const [listening, setListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const recognitionRef = useRef(null);
    const [debug, setDebug] = useState("Appuyer sur le bouton pour commencer");

    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
        alert("La reconnaissance vocale n'est pas supportée par ce navigateur.");
        setDebug("❌ SpeechRecognition non disponible");
        return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "fr-FR";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log("🎤 Début écoute");
            setDebug("🎤 Début écoute");
            setListening(true);
            setProcessing(false);
        };

        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            console.log("📝 Résultat :", text);
            setDebug(text);
            setProcessing(true);

            const response = await fetch(`/iarequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                }),
            });

            const result = await response.json();

            console.log("Réponse serveur :", result);

            setProcessing(false);
            setListening(false);
            recognition.stop();
            onFinished();
        };

        recognition.onerror = (event) => {
            console.log("❌ Erreur :", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            console.log("🛑 Fin écoute");
            setListening(false);
        };

        recognitionRef.current = recognition;

        recognition.start();
  };

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
        {debug}
    </>
  );
}

export default VoiceButton;