import { useParams } from "react-router-dom";
import Spinner from "../../utils/Spinner";
import { useFetch } from "../../hooks/useFetch";
import QuestionBox from "../../components/QuestionBox";

export default function Topic() {
  const { topicName } = useParams();
  const { data, error, isLoading } = useFetch(`/questions/topic/${topicName}`);

  console.log(data);

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
        <p className="text-center text-white">
          No questions for &quot;<b>{topicName}</b>&quot; posted yet.
        </p>
      )}
    </div>
  );
}
