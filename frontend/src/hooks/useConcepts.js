import { useState, useCallback } from 'react';
import { conceptService } from '../services/conceptService';

export const useConcepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConcepts = useCallback(async (folderId) => {
    if (!folderId) return;
    setLoading(true);
    try {
      const data = await conceptService.getConcepts(folderId);
      setConcepts(data);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      console.error('Error fetching concepts:', message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConceptById = useCallback(async (conceptId) => {
    setLoading(true);
    try {
      const data = await conceptService.getConceptById(conceptId);
      setError(null);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createConcept = useCallback(async (conceptData) => {
    setLoading(true);
    try {
      const newConcept = await conceptService.createConcept(conceptData);
      setConcepts((prev) => [newConcept, ...prev]);
      setError(null);
      return newConcept;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConcept = useCallback(async (conceptId) => {
    try {
      await conceptService.deleteConcept(conceptId);
      setConcepts((prev) => prev.filter((c) => c._id !== conceptId));
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw new Error(message);
    }
  }, []);

  const updateConcept = useCallback(async (conceptId, updates) => {
    try {
      const updatedConcept = await conceptService.updateConcept(conceptId, updates);
      setConcepts((prev) =>
        prev.map((c) => (c._id === conceptId ? updatedConcept : c))
      );
      setError(null);
      return updatedConcept;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw new Error(message);
    }
  }, []);

  return {
    concepts,
    loading,
    error,
    fetchConcepts,
    fetchConceptById,
    createConcept,
    deleteConcept,
    updateConcept,
  };
};