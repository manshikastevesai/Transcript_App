import axiosInstance from "../../Interceptor/Interceptor";

export const Admin = async (userDetails) => {
  console.log(userDetails, "userDetails");
  try {
    const res = await axiosInstance.post(`/admin/create_customer`, userDetails);
    return res.data;
  } catch (error) {
    console.log("Error fetching SuperAdmin");
    throw error;
  }
};

export const editCustomer = async ({ customer_id, ...userDetails }) => {
  try {
    const res = await axiosInstance.patch(
      `/admin/update_customer/${customer_id}`,
      userDetails
    );
    return res.data;
  } catch (error) {
    console.log("Error updating user:", error);
    throw error;
  }
};

export const deleteCustomer = async ({ customer_id }) => {
  try {
    const res = await axiosInstance.delete(
      `/admin/delete-customer/${customer_id}`
    );
    return res;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const inviteCustomer = async (customer_id) => {
  const id = customer_id.customer_id;

  try {
    const res = await axiosInstance.post(``);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const GetCustomer = async () => {
  try {
    const res = await axiosInstance.get(`/admin/get_all_customer`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const AddCategory = async (payload) => {
  try {
    const res = await axiosInstance.post(`/issues/category`, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const ListCategories = async () => {
  try {
    const res = await axiosInstance.get(`/issues/full`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const GetAllResolutionList = async () => {
  try {
    const res = await axiosInstance.get(`/issues/full`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const AddIssue = async (category_id, payload) => {
  try {
    const res = await axiosInstance.post(
      `/issues/category/${category_id}/issue`,
      payload
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const ListIssues = async (category_id) => {
  try {
    const res = await axiosInstance.get(`/issues/issues/${category_id}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const AddSteps = async (issue_id, payload) => {
  try {
    const res = await axiosInstance.post(`/issues/steps/${issue_id}`, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const ListSteps = async (issue_id) => {
  try {
    const res = await axiosInstance.get(`/issues/steps/${issue_id}`);
    return res;
  } catch (error) {
    throw error;
  }
};
export const CreateResolutions = async (payload) => {
  try {
    const res = await axiosInstance.post(`/issues/add`, payload);
    return res;
  } catch (error) {
    throw error;
  }
};

export const UploadAndProcessFile = async (user_id, formdata) => {
  try {
    const res = await axiosInstance.post(
      `/admin/upload-and-process/?user_id=${user_id}`,
      formdata
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const ShowAllHistoryOfUsers = async () => {
  const res = await axiosInstance.get("/admin/all_users_dashboard");
  return res.data;
};

// export const GetChatHistory = async (user_id) => {
//   const res = await axiosInstance.get(`/chat/historys/${user_id}`);
//   return res.data;
// };
