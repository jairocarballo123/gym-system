import { useState, useEffect, useCallback } from 'react';
import { membersApi } from '../../../Api/MemberApi'; 

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err) {
      setError("Error al cargar miembros");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);


  const deleteMember = async (id) => {

    try {
      await membersApi.delete(id);
  
      await loadMembers(); 
    } catch (err) {
      setError("Error al eliminar el miembro");
    }
  };

  const createMember = async (data) => {
    try {
      await membersApi.create(data);
      await loadMembers();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateMember = async (id, data) => {
    try {
      await membersApi.update(id, data);
      await loadMembers();
      return true;
    } catch (err) {
      throw err;
    }
  };

  return { 
    members, 
    loading, 
    error, 
    refreshMembers: loadMembers,
    deleteMember,
    createMember,
    updateMember 
  };
};