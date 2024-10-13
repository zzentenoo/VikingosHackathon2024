
import { createContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
    email: string | null;
    setEmail: (email: string | null) => void;
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({
    email: null,
    setEmail: () => {},
});

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [email, setEmail] = useState<string | null>("finpal@hola.com");

    useEffect(() => {
        console.log("UserContext initialized with email:", email);
    }, [email]);

    return (
        <UserContext.Provider value={{ email, setEmail }}>
            {children}
        </UserContext.Provider>
    );
};