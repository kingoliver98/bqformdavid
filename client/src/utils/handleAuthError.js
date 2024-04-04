import toast from "react-hot-toast";

const handleAuthError = (error) => {
  console.log(error);
  if (error?.message === "Network Error") {
    return toast.error("Server is down");
  }
  if (error?.response) {
    return toast.error(error.response.data.message || "An error occured");
  }

  toast.error("An unexpected error occured");
};

export default handleAuthError;
