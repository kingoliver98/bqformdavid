import Navbar1 from "../components/navbar1/Navbar1";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Badge } from "react-bootstrap";
import Topics from "../components/topics/Topics";
import AskQuestion from "../components/questions/AskQuestion";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { useFetch } from "../hooks/useFetch";

const RootLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("");
  const { data } = useFetch("/topics");

  const getTopic = (topicName) => {
    setSelectedTopic(topicName);
    navigate(`/topic/${topicName}`);
  };

  return (
    <>
      <Navbar1 />
      <Container className="d-lg-flex gap-4 mt-4 mt-md-5 py-5">
        <Topics />
        <div className="d-flex d-md-none my-4 overflow-scroll scrollbody">
          {data?.topics?.map((topic) => (
            <Badge
              bg={topic.name === selectedTopic ? "success" : "secondary"}
              key={topic._id}
              onClick={() => getTopic(topic.name)}
              className="me-2 mb-1 cursor"
            >
              {topic.name}
            </Badge>
          ))}
        </div>
        <div className="px-3 outlet" style={{ minHeight: "95dvh" }}>
          {user && <AskQuestion />}
          <Outlet />
        </div>
      </Container>
    </>
  );
};

export default RootLayout;
