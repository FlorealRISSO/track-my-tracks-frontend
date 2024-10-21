import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the auto parameter
const LoginContext = createContext('');

// Provider component
const LoginProvider = ({ children }) => {
    const [key, setKey] = useState('');

    useEffect(() => {
        // Access the current URL parameters
        const params = new URLSearchParams(window.location.search);
        const autoKey = params.get('key');

        if (autoKey !== null) {
            setKey(autoKey);
        }
    }, []);

    return (
        <LoginContext.Provider value={key}>
            {children}
        </LoginContext.Provider>
    );
};

// Custom hook to use the AutoContext
const useKey = () => {
    return useContext(LoginContext);
};

export { LoginProvider, useKey }