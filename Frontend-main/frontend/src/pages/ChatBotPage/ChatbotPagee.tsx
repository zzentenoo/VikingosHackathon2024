import { useState, FormEvent, ChangeEvent } from "react";
import { LogButton } from "../../components";
import httpInstance from "../../services/httpInstance.ts";// Import httpInstance
import finpalImage from "/pal_icon_happy.png";
import "./ChatbotPage.css";
import {useNavigate} from "react-router-dom";

interface Message {
    sender: "user" | "bot";
    text: string;
}

const ChatbotPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputText.trim() === "") {
            return;
        }

        const userMessage: Message = { sender: "user", text: inputText };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setLoading(true);

        try {
            const response = await httpInstance.post<{ reply: string }>("user/chatbot/", {
                message: inputText,
            });

            // Add bot's response to the chat
            const botMessage: Message = { sender: "bot", text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching bot response:", error);
            // Optionally display an error message to the user
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 font-rubik bg-gray-100">
            <LogButton onClick={() => navigate(-1)} color={"bg-red-400 text-white "} children={"Back"}/>
            <div className="flex flex-col w-full max-w-xl">
                {/* Chat Messages */}
                <div className="chat-messages flex flex-col space-y-4 overflow-y-auto h-96 p-4 bg-white rounded-lg shadow-md">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            {message.sender === "bot" && (
                                <img
                                    src={finpalImage}
                                    alt="FinPal"
                                    className="w-8 h-8 rounded-full mr-2"
                                    draggable="false"
                                />
                            )}
                            <div
                                className={`p-3 rounded-lg ${
                                    message.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start items-center">
                            <img
                                src={finpalImage}
                                alt="FinPal"
                                className="w-8 h-8 rounded-full mr-2"
                                draggable="false"
                            />
                            <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                                Pensando...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="w-full flex mt-4 space-x-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Escribe tu mensaje..."
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        disabled={loading}
                    />
                    <LogButton
                        type="submit"
                        color="bg-blue-500 text-lg text-white hover:bg-blue-600"
                        disabled={loading}
                    >
                        Enviar
                    </LogButton>
                </form>
            </div>
        </div>
        </div>
    );
};

export default ChatbotPage;
