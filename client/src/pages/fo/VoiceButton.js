import { useRef, useState } from "react";

function VoiceButton({ onResult }) {
    const [listening, setListening] = useState(false);
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
        };

        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            console.log("📝 Résultat :", text);
            setDebug(text);

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

            setListening(false);
            recognition.stop();
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
        <button onClick={startRecognition} className={`voice-button ${listening ? "listening" : ""}`}>
            {listening ? "🔴" : "🎤"}
        </button>
        {debug}
    </>
  );
}

export default VoiceButton;