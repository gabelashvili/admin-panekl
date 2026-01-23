import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/axios-config";
import requestsTags from "./tags";

const useRequestStatusChange = () => {
    return useMutation({
      mutationFn: async (values: {helpRequestId: string, accepted: boolean}): Promise<any> => {
        const { data } = await api.post('help/respond', values)
        return data
      }
    })
}

const useRequestStatusComplete = () => {
  return useMutation({
    mutationFn: async (helpRequestId: string): Promise<any> => {
      const { data } = await api.post('help/complete', {helpRequestId})
      return data
    }
  })
}

const useRequestDocumentGenerate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: {HelpRequestId: string, Document: Blob}): Promise<any> => {
      const formData = new FormData()
      formData.append('HelpRequestId', values.HelpRequestId)
      console.log(values.Document);
      formData.append("Document", values.Document, "document.pdf");
      const { data } = await api.post('help/upload-document', formData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [requestsTags.requests] });
      queryClient.invalidateQueries({ queryKey: ['new-requests'] });
    }
  })
}

const useRequestCancel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (values: { helpRequestId: string }): Promise<any> => {
      const { data } = await api.post('help/cancel', values)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [requestsTags.requests] });
      queryClient.invalidateQueries({ queryKey: ['new-requests'] });
    }
  })
}



export { useRequestStatusChange, useRequestStatusComplete, useRequestDocumentGenerate, useRequestCancel }