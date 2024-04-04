import { NavLink } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { Image } from "react-bootstrap";
import Spinner from "../../utils/Spinner";

const Topics = () => {
  const { data, error, isLoading } = useFetch("/topics");

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      className="position-fixed d-none d-md-block"
      style={{ width: "250px" }}
    >
      <div
        className="p-4 rounded-3 shadow text-white"
        style={{ backgroundColor: "var(--lightGray)" }}
      >
        <h1 className="fs-4 mb-3">Topics</h1>
        <div style={{ height: "400px" }} className="overflow-scroll scrollBody">
          {data
            ? data.topics.map(({ _id, name, image }) => (
                <div key={_id}>
                  <NavLink
                    className="cursor text-white mb-3 "
                    to={`/topic/${name}`}
                  >
                    <Image
                      src={image}
                      alt={name}
                      style={{ width: "40px", height: "40px" }}
                      fluid
                      className="rounded-2 object-fit-cover"
                    />
                    <span className="ms-2">{name}</span>
                  </NavLink>
                  <hr className="text-white" />
                </div>
              ))
            : null}
        </div>
      </div>
      <div className="d-flex gap-2 small mt-4 text-white-50">
        <span>About</span>
        <span>Help</span>
        <span>Blog</span>
        <span>Account</span>
      </div>
    </div>
  );
};

export default Topics;
