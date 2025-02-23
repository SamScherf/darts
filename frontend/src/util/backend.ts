import axios from "axios"
import { Average } from "src/hooks/useRawAverages";
import { User } from "src/hooks/useUsers";
import { Throw } from "./Throw";

const BACKEND_URL = "http://localhost:5000/api"

export async function listUsers(password: string) {
	return post<User[]>("/users/list", {password})
}

export async function createUser(username: string, password: string) {
	return post("/users/create", {password, username})
}

export async function getRawAverages(password: string) {
	return post<Average[]>("/stats/raw-averages", {password})
}

export async function addGame(throws: Throw[], password: string) {
	return post("/games/add", {password, throws})
}

export async function login(password: string) {
	return post("/auth/login", {password});
}

async function post<T>(relativeUrl: string, payload: any): Promise<T> {
	return (await axios.post<T>(BACKEND_URL + relativeUrl, payload)).data;
}
