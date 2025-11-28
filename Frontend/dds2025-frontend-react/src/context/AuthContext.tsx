import axios, { AxiosError } from 'axios';
import { createContext, useCallback, useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import type { AuthContextType, LoginData, RegisterData, ResetPasswordData } from "../types/AuthTypes";
import type { User } from "../types/UserTypes";
// Asegúrate de que LOGIN_API_URL sea "/auth/token" en tu constants/api.ts
import { API_BASE_URL, REFRESH_TOKEN_URL, LOGIN_API_URL, VALIDATE_USER_URL, USER_API_URL, LOGOUT_API_URL, REGISTER_API_URL, RESET_PASSWORD_API_URL } from "../constants/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>();
    const tokenRefreshedRef = useRef(false);

    const api = useMemo(() => axios.create({
        baseURL: API_BASE_URL,
        timeout: 5000,
        withCredentials: true // Permite envío de cookies
    }), []);

    const fetchCurrentUser = useCallback(async (userId: string, tempToken: string | null = null) => {
        const headers = tempToken ? { Authorization: `Bearer ${tempToken}` } : {};
        try {
            const response = await api.get(`${USER_API_URL}/${userId}`, { headers: headers });
            setCurrentUser(response.data);
            setIsAuthenticated(true);
            setError(null);
        } catch (e) {
            console.error("Error fetching user", e);
        }
    }, [api]);

    // Validación inicial al cargar la app
    useEffect(() => {
        const validateUser = async () => {
            try {
                setIsLoading(true);
                let res = await api.get(`${VALIDATE_USER_URL}`);
                setToken(res.data.access_token);
                await fetchCurrentUser(res.data.user_id, res.data.access_token);
            }
            catch (error) {
                setToken(null);
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
            finally {
                setIsLoading(false);
            }
        }
        validateUser();
    }, [api, fetchCurrentUser]);

    // Interceptor: Inyectar token en cada petición
    useLayoutEffect(() => {
        const authInterceptor = api.interceptors.request.use(
            (config) => {
                const isAuthEndpoint = [LOGIN_API_URL, REFRESH_TOKEN_URL].some(
                    url => config.url?.endsWith(url)
                );

                if (!isAuthEndpoint && token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            api.interceptors.request.eject(authInterceptor);
        };
    }, [token, api]);

    // Interceptor: Refrescar token si caduca (401/403)
    useLayoutEffect(() => {
        const refreshInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                setError(null);

                if (
                    (error.response?.status === 403 || error.response?.status === 401) &&
                    originalRequest.url !== REFRESH_TOKEN_URL &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;
                    try {
                        const response = await api.put(REFRESH_TOKEN_URL);
                        setToken(response.data.access_token);
                        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                        tokenRefreshedRef.current = true;
                        return api(originalRequest);
                    }
                    catch (err) {
                        setToken(null);
                        setIsAuthenticated(false);
                        setCurrentUser(null);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(refreshInterceptor);
        };
    }, [api]);

    // --- CORRECCIÓN PARA EL ERROR 400 ---
    const login = useCallback(async (loginData: LoginData): Promise<boolean> => {
        if (!loginData) return false;

        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            params.append('username', loginData.username);
            params.append('password', loginData.password);

            const response = await api.post(LOGIN_API_URL, params);

            const { access_token, user_id } = response.data;

            setToken(access_token);
            await fetchCurrentUser(user_id, access_token);
            return true;

        } catch (err: any) {
            console.error("Login error detail:", err.response?.data);
            const errorMessage = err.response?.data?.detail || 'Usuario o contraseña incorrectos';
            setError(errorMessage);
            setCurrentUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }

    }, [api, fetchCurrentUser]);

    const logout = async (): Promise<void> => {
        try {
            await api.delete(LOGOUT_API_URL);
        } catch (e) {
            console.error("Logout error", e);
        }
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const register = useCallback(async (registerData: RegisterData): Promise<boolean> => {
        return false;
    }, []);

    const resetPassword = useCallback(async (resetPasswordData: ResetPasswordData): Promise<boolean> => {
        return false;
    }, []);

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated,
            isLoading,
            setIsLoading,
            error,
            setError,
            login,
            logout,
            register,
            resetPassword,
            api
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
