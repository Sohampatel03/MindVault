import { useState, useEffect } from 'react';
import { conceptService } from '../services/conceptService';

export const useConcepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConcepts = async (folderId) => {
    if (!folderId) return;
    
    setLoading(true);
    try {
      const data = await conceptService.getConcepts(folderId);
      setConcepts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching concepts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createConcept = async (conceptData) => {
    setLoading(true);
    try {
      const newConcept = await conceptService.createConcept(conceptData);
      setConcepts(prev => [newConcept, ...prev]);
      setError(null);
      return newConcept;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteConcept = async (conceptId) => {
    try {
      await conceptService.deleteConcept(conceptId);
      setConcepts(prev => prev.filter(concept => concept._id !== conceptId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateConcept = async (conceptId, updates) => {
    try {
      const updatedConcept = await conceptService.updateConcept(conceptId, updates);
      setConcepts(prev => prev.map(concept => 
        concept._id === conceptId ? updatedConcept : concept
      ));
      setError(null);
      return updatedConcept;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    concepts,
    loading,
    error,
    fetchConcepts,
    createConcept,
    deleteConcept,
    updateConcept
  };
};