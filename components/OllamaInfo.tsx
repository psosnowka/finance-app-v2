
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
                <h2 className="text-2xl font-bold text-white">Informacje o Lokalnym AI (Ollama)</h2>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-6">Czym jest Ollama?</h3>
                <p>Ollama to narzędzie, które pozwala na uruchamianie dużych modeli językowych (takich jak Llama 3) bezpośrednio na Twoim komputerze. Daje to pełną prywatność i kontrolę nad danymi, ponieważ nic nie jest wysyłane na zewnętrzne serwery.</p>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-6">Dlaczego ta aplikacja nie może używać Ollamy bezpośrednio?</h3>
                <p>Ta aplikacja działa w całości w Twojej przeglądarce internetowej. Ze względów bezpieczeństwa, przeglądarki internetowe mają ścisłe ograniczenia (tzw. politykę CORS), które uniemożliwiają stronie internetowej bezpośrednie łączenie się z lokalnymi programami, takimi jak serwer Ollama. Aby to zadziałało, potrzebny byłby dodatkowy komponent serwerowy (backend), który pośredniczyłby w komunikacji.</p>
                <p>Dlatego, aby zapewnić działającą i łatwo dostępną wersję demonstracyjną, aplikacja ta korzysta z API Gemini od Google. Jest to rozwiązanie chmurowe, które działa bezproblemowo z aplikacjami przeglądarkowymi.</p>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-6">Jak skonfigurować Ollamę do własnych projektów?</h3>
                <p>Jeśli jesteś deweloperem i chcesz używać Ollamy, oto krótka instrukcja:</p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>
                        <strong>Pobierz Ollamę:</strong> Wejdź na stronę <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">ollama.com</a> i pobierz instalator dla swojego systemu operacyjnego (macOS, Windows, lub Linux).
                    </li>
                    <li>
                        <strong>Zainstaluj:</strong> Uruchom pobrany instalator.
                    </li>
                    <li>
                        <strong>Pobierz model:</strong> Otwórz terminal (lub Wiersz polecenia na Windows) i wpisz komendę, aby pobrać rekomendowany model do zadań analitycznych. <strong className="text-gray-200">Llama 3 8B</strong> jest świetnym, wszechstronnym wyborem.
                        <pre className="bg-gray-900 rounded-md p-3 my-2 text-sm text-yellow-300"><code>ollama pull llama3:8b</code></pre>
                    </li>
                     <li>
                        <strong>Uruchom model:</strong> Po pobraniu, możesz z nim rozmawiać bezpośrednio w terminalu:
                        <pre className="bg-gray-900 rounded-md p-3 my-2 text-sm text-yellow-300"><code>ollama run llama3:8b</code></pre>
                        Ollama uruchomi również serwer API w tle (domyślnie na `http://localhost:11434`), z którym mogą komunikować się Twoje inne aplikacje (np. backend w Node.js lub Python).
                    </li>
                </ol>

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
