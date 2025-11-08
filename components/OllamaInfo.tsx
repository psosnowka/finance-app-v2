import React from 'react';

interface OllamaInfoProps {
    show: boolean;
    onClose: () => void;
}

const OllamaInfo: React.FC<OllamaInfoProps> = ({ show, onClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-8 relative prose prose-invert prose-sm" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-white">Wymagana Konfiguracja: Ollama</h2>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-6">Prywatna analiza AI na Twoim komputerze</h3>
                <p>Ta aplikacja do działania wymaga lokalnie uruchomionego serwera AI - Ollama. Dzięki temu Twoje dane finansowe nigdy nie opuszczają Twojego komputera, zapewniając 100% prywatności i bezpieczeństwa.</p>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-6">Instrukcja konfiguracji (2 minuty)</h3>
                <p>Aby uruchomić analizę, postępuj zgodnie z poniższymi krokami:</p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <strong>Pobierz Ollamę:</strong> Wejdź na stronę <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">ollama.com</a> i pobierz instalator dla swojego systemu (macOS, Windows, lub Linux).
                    </li>
                    <li>
                        <strong>Zainstaluj Ollamę:</strong> Uruchom pobrany plik i postępuj zgodnie z instrukcjami.
                    </li>
                    <li>
                        <strong>Pobierz model AI:</strong> Otwórz terminal (lub Wiersz polecenia na Windows) i wklej poniższą komendę, aby pobrać model językowy (Llama 3 8B). Jest to jednorazowa operacja.
                        <pre className="bg-gray-900 rounded-md p-3 my-2 text-sm text-yellow-300"><code>ollama pull llama3:8b</code></pre>
                    </li>
                     <li>
                        <strong>Gotowe!</strong> Po zakończeniu pobierania modelu, Ollama będzie działać w tle. Możesz teraz zamknąć to okno i przesłać plik CSV do analizy.
                    </li>
                </ol>
                <p className="mt-4 text-sm text-gray-400">Jeśli aplikacja nadal nie będzie mogła się połączyć, upewnij się, że ikona Ollamy jest widoczna na pasku zadań (lub pasku menu) i że żadne oprogramowanie antywirusowe nie blokuje jej działania.</p>

                 <div className="mt-8 text-center">
                     <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition duration-300">
                        Rozumiem
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default OllamaInfo;
