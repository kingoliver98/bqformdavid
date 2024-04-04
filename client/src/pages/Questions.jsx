import { useFetch } from "../hooks/useFetch";
import Spinner from "../utils/Spinner";
import { useSearchParams } from "react-router-dom";
import QuestionBox from "../components/QuestionBox";

export default function Questions() {
  const [searchParams] = useSearchParams();
  const queryParams = searchParams.get("query");
  const queryArray = queryParams.split(",");
  console.log(queryParams);
  console.log(queryArray);
  const { data, error, isLoading } = useFetch("/questions");
  console.log("qd", data);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const getMatch = data?.filter((item) =>
    queryArray.some((query) => item.topic.includes(query))
  );

  console.log("gt", getMatch);

  return (
    <>
      {getMatch.length > 0 ? (
        <>
          {getMatch.map((item) => (
            <QuestionBox key={item._id} {...item}/>
          ))}
        </>
      ) : (
        <p className="text-white text-center">
          No result matching the selected topics
        </p>
      )}
    </>
  );
}
