import { apiEndpoint } from "../config";
import { Cat } from "../types/Cat";
import { CreateCatRequest } from "../types/CreateCatRequest";
import Axios, { AxiosResponse } from "axios";
import { UploadUrl } from "../types/UploadUrl";

/**
 * Call API to create a Cat
 * @param jwt
 * @param newCat
 */
export async function createCat(
  jwt: string,
  newCat: CreateCatRequest
): Promise<AxiosResponse<Cat>> {
  return await Axios.post(`${apiEndpoint}/cats`, JSON.stringify(newCat), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

/**
 * Call API to update a Cat
 * @param jwt
 * @param catId
 * @param race
 * @param gender
 * @param age
 * @param name
 */
export async function updateCat(
  jwt: string,
  catId: string,
  race: string,
  gender: string,
  age: string,
  name: string
): Promise<AxiosResponse<Cat>> {
  return await Axios.put(
    `${apiEndpoint}/cats/fostered/${catId}`,
    JSON.stringify({ race, gender, age, name }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
}

/**
 * Call API to get cats fostered by a user
 * @param jwt
 */
export async function getUserCats(jwt: string): Promise<AxiosResponse<Cat[]>> {
  return await Axios.get(`${apiEndpoint}/cats/fostered`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

/**
 * Call API to get all fostered cats
 */
export async function getAllCats(): Promise<AxiosResponse<Cat[]>> {
  return await Axios.get(`${apiEndpoint}/cats/fostered`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Call API to get a signed url for updating cat photo
 * @param jwt
 * @param catId
 */
export async function getPhotoUploadUrl(
  jwt: string,
  catId: string
): Promise<AxiosResponse<UploadUrl>> {
  return await Axios.get(`${apiEndpoint}/cats/fostered/${catId}/uploadUrl`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

/**
 * Useful for checking if an image exists
 * without actually performing the get
 */
export const checkIfExists = async (
  jwt: string,
  url: string
): Promise<boolean> => {
  try {
    await Axios.head(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Use a signed url to update a photo for a cat
 * @param uploadUrl
 * @param file
 */
export async function putPhoto(
  uploadUrl: string,
  file: File
): Promise<AxiosResponse> {
  return await Axios.put(uploadUrl, file);
}

/**
 * Call API to get cats fostered by a user
 * @param jwt
 * @param catId
 */
export async function deleteCat(
  jwt: string,
  catId: string
): Promise<AxiosResponse<Cat[]>> {
  return await Axios.delete(`${apiEndpoint}/cats/fostered/${catId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}
