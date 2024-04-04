import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(url);
        console.log(data);
        setData(data);
      } catch (error) {
        console.log(error);
        setError("Error Occurred");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [url]);

  return { data, isLoading, error, setData };
};
