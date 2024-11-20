import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UsuarioService } from '@/app/(tabs)/services/usuarioService';
import { Usuario } from '@/app/(tabs)/services/models/usuario';

const UserContext = createContext<Usuario | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Faz a requisição ao backend com o firebase_uid para buscar os dados do usuário
          const response = await UsuarioService.getUsuario(firebaseUser.uid);

          // Configura o estado do usuário com os dados retornados do MySQL
          setUser({
            id: response.id,
            firebaseUid: response.firebaseUid,
            nome: response.nome,
            email: response.email,
            dataNascimento: response.dataNascimento,
            tipoUsuario: response.tipoUsuario,
            cpf: response.cpf,
            cnpj: response.cnpj,
            fotoPath: response.fotoPath
          });
        } catch (error) {
          console.error("Erro ao buscar informações do usuário:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Ou um spinner de carregamento
  }

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook para acessar o contexto do usuário
export function useUser() {
  return useContext(UserContext);
}
