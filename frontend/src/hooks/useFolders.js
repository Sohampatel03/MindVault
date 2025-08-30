// hooks/useFolders.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { folderService } from '../services/folderService';

export const useFolders = () => {
  return useQuery({
    queryKey: ['folders'],
    queryFn: folderService.getAllFolders,
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: folderService.createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
};