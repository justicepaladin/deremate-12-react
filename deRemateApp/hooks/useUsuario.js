import { useEffect, useState } from "react";
import { getUsuarioDetalle } from "@/services/user";

export const useUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getUsuarioDetalle();
        setUsuario(data);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  return { usuario, loading, error };
};
