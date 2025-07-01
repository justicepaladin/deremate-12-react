import { useState } from 'react';

export const useErrorHandler = () => {
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "", title: "Error" });

  const showError = (message, title = "Error") => {
    setErrorAlert({
      visible: true,
      message,
      title
    });
  };

  const hideError = () => {
    setErrorAlert({ visible: false, message: "", title: "Error" });
  };

  const handleAsyncError = async (asyncFunction, errorTitle = "Error") => {
    try {
      return await asyncFunction();
    } catch (error) {
      showError(error.message || "Ocurrió un error inesperado", errorTitle);
      throw error; // Re-lanzar el error para que el componente pueda manejarlo si es necesario
    }
  };

  return {
    errorAlert,
    showError,
    hideError,
    handleAsyncError
  };
}; 