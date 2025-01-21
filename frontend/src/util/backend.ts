import axios from "axios"

const BACKEND_URL = "http://localhost:5000"

export async function post<T>(relativeUrl: string, payload: any): Promise<T> {
	return (await axios.post<T>(BACKEND_URL + relativeUrl, payload)).data;
}