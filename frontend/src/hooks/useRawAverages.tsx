import { useQuery } from '@tanstack/react-query'
import { post } from 'src/util/backend';
import { getToaster } from 'src/util/toaster';

export type Average = {
    user: string;
    averageScore: number;
}

export const useRawAverages = (password: string) => useQuery({
    queryKey: ['users'],
    queryFn: async () => {
        const toaster = await getToaster();
        try {
			return await post<Average[]>("/get-raw-averages", {password})
		} catch(e: any) {
			if (e.response) {
				const statusCode = e.response.status;
				if (statusCode === 401) {
					toaster.show({intent: "danger", message: "Invalid password" });
				} else if (statusCode === 429) {
					toaster.show({intent: "danger", message: "Too many attempts, please wait 1 minute" });
				} else {
				    toaster.show({intent: "danger", message: "Error" });
                }
			} else {
				toaster.show({intent: "danger", message: "Error" });
			}
			console.warn(e);
		}
    },
    staleTime: Infinity,
  })