
import  { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {LogButton} from "../../components";
import {ROUTES} from "../../routes";
import {signUp} from "../../services/userRequests/authService.ts";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            await signUp({
                email: formData.email,
                password: formData.password,
            });


            navigate(ROUTES.LOGIN);
        } catch (err: any) {
            // Handle errors returned from the server
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Ocurrió un error durante el registro.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-40 md:pt-10 px-4 font-rubik space-y-5 text-center">
            <img
                src="/pal_icon.png"
                alt="FinPal img"
                className="w-1/2 max-w-xs h-auto"
                draggable="false"
            />
            <h1 className="text-5xl">SIGN UP</h1>
            <h2 className="text-gray-400 text-sm">
                Tu acompañante financiero personal
            </h2>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm flex flex-col space-y-4"
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <LogButton
                    type="submit"
                    color={
                        loading
                            ? "bg-gray-400 text-2xl text-white w-full cursor-not-allowed"
                            : "bg-[#FF0000] text-2xl text-white w-full"
                    }
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "SIGN UP"}
                </LogButton>
            </form>
            <LogButton
                color="bg-gray-400 text-2xl text-white"
                onClick={() => navigate(-1)}
            >
                BACK
            </LogButton>
        </div>
    );
};

export default SignUpPage;
