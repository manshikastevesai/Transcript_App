import axiosInstance from "../../Interceptor/Interceptor";

export const signUpService = async (userDetails) => {
  try {
    const res = await axiosInstance.post("/auth/register/", userDetails);
    return res;
  } catch (error) {
    console.log("Error fetching signUpService:", error);
    throw error;
  }
};

export const signInService = async (userDetails) => {
  console.log(userDetails, "userDetails");

  try {
    const res = await axiosInstance.post("/auth/login", userDetails);
    return res;
  } catch (error) {
    console.log("Error fetching signInService:", error);
    throw error;
  }
};
