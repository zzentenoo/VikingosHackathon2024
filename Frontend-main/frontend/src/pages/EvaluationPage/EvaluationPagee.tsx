// src/pages/EvaluationPage/EvaluationPage.tsx
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogButton } from "../../components";
import { UserContext } from "../../contexts/UserContext";
import { evaluateContext } from "../../services/userRequests/contextService";
import finpalImage from "/pal_icon_happy.png";
import "./ContextEvaluationPage.css";
import { ROUTES } from "../../routes";

const EvaluationPage = () => {
    const navigate = useNavigate();
    const { email } = useContext(UserContext);
    const [context, setContext] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContext(e.target.value);
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (context.trim() === "") {
            setError("Por favor, ingresa el contexto.");
            return;
        }
        setLoading(true);
        try {
            const response = await evaluateContext({
                email,
                text: context,
            });
            console.log("Respuesta del servidor:", response);
            navigate(ROUTES.LEARNINGPATH, { state: { data: response } });
        } catch (err: any) {
            console.error("Error al enviar la solicitud:", err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-rubik bg-gray-100">
            {/* Chat Bubble */}
            <div className="flex items-start space-x-4 max-w-xl w-full mb-6">
                <img src={finpalImage} alt="FinPal" className="w-16 h-16 rounded-full" draggable="false"/>
                <div className="relative bg-white p-4 rounded-lg shadow-md">
                    <p className="text-gray-800 typing-animation">
                        Hola! 😊 ¿En qué puedo ayudarte hoy?
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col space-y-4">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <textarea
                    value={context}
                    onChange={handleChange}
                    placeholder="Ingresa el contexto aquí..."
                    rows={6}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    required
                />
                <LogButton
                    type="submit"
                    color={
                        loading
                            ? "bg-gray-400 text-lg text-white cursor-not-allowed"
                            : "bg-blue-500 text-lg text-white hover:bg-blue-600"
                    }
                    disabled={loading}
                >
                    {loading ? "Pensando..." : "Enviar"}
                </LogButton>
            </form>

            {/* Loading Indicator */}
            {loading && (
                <div className="mt-4 flex items-center space-x-2">
                    <p className="text-gray-600">Pensando</p>
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-200"></span>
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-400"></span>
                    </div>
                </div>
            )}

        </div>
    );

};

export default EvaluationPage;
