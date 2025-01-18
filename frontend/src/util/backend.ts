import axios from "axios"

const BACKEND_URL = "http://localhost:5000"

export async function post(relativeUrl: string, payload?) {
	return axios.post(BACKEND_URL + relativeUrl, payload)
}