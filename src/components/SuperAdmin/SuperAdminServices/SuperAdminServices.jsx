import axiosInstance from "../../Interceptor/Interceptor";

export const SuperAdmin = async (userDetails) => {
  console.log(userDetails, "userDetails");
  try {
    const res = await axiosInstance.post(`/super/create-admin`, userDetails);
    return res;
  } catch (error) {
    console.log("Error fetching SuperAdmin");
    throw error;
  }
};

export const editAdmin = async ({ company_id, ...userDetails }) => {
  try {
    const res = await axiosInstance.put(
      `/super/update-company/${company_id}`,
      userDetails
    );
    return res;
  } catch (error) {
    console.log("Error updating user:", error);
    throw error;
  }
};

export const deleteAdmin = async ({ company_id }) => {
  try {
    const res = await axiosInstance.delete(
      `/super/delete-company/${company_id}`
    );
    return res;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const inviteAdmin = async (company_id) => {
  const id = company_id.company_id;

  try {
    const res = await axiosInstance.post(`/super/send-admin-credentials/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const GetAdmin = async () => {
  try {
    const res = await axiosInstance.get(`/super/get-all-companies`);
    return res;
  } catch (error) {
    throw error;
  }
};
