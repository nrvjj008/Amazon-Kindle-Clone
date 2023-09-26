import axios from 'axios';


// authUtility.ts
export const getAccessToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem('access_token') : null;
}

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Common base URL for your Django backend
    timeout: 30000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
    }
});


// Interceptor to add the token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor for responses
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // If the token has expired, try to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');

        try {
            const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });
            if (res.status === 200) {
                localStorage.setItem('access_token', res.data.access);
                api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);
            }
        } catch (err) {
            console.error("Refresh token request failed: ", err);

            // If refresh token has failed, clear local storage and redirect the user to the login page
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';


            return Promise.reject(error);
        }
    }

    if (error.response && error.response.data) {
        // Handle other common error status codes
        switch (error.response.status) {
            case 403:
                // Handle forbidden error
                console.error('Forbidden');
                break;
            // Add more common error statuses if needed
        }
        return Promise.reject(error.response.data);
    }

    return Promise.reject(error.message);
});

export default api;
