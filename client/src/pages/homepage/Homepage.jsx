import { useFetch } from "../../hooks/useFetch";
import QuestionBox from "../../components/QuestionBox";
import Spinner from "../../utils/Spinner";

const Homepage = () => {
  const { data, error, isLoading } = useFetch("/questions/random");

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-white">{error}</p>;
  }

  return (
    <div>
      {data.length > 0 ? (
        <>
          {data.map((item) => (
            <QuestionBox key={item._id} {...item} />
          ))}
        </>
      ) : (
        <p className="text-center text-white">No questions asked yet.</p>
      )}
    </div>
  );
};

export default Homepage;
