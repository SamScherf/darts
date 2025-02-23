import { useQuery } from '@tanstack/react-query'
import { listUsers } from 'src/util/backend';
import { getToaster } from 'src/util/toaster';

export type User = {
    username: string;
}

export const useUsers = (password: string) => useQuery({
    queryKey: ['users'],
    queryFn: async () => {
        const toaster = await getToaster();
        try {
			return await listUsers(password)
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