import { createContext } from "react";

interface User {
    login: string,
    first_name: string,
    last_name: string,
    email: string,
    imageURL: string,
    JWTtoken?: string,
}

interface AuthContextType {
    user?: User,
    loading: boolean,
    error?: unknown,
    login_42: () => void,
    logout: () => void,
}

export const AuthContext = createContext<AuthContextType>
    ({} as AuthContextType);

export function AuthProvider({ children } : 
    { children: React.ReactNode }): JSX.Element {
        const [user, setUser] = useState<User>();
        const [erro]
    }