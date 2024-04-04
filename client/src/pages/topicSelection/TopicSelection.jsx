import { useFetch } from "../../hooks/useFetch";
import "./TopicSelection.css";
import { Container, Button, Image, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { IoRadioButtonOffSharp, IoRadioButtonOnOutline } from "react-icons/io5";
import Spinner from "../../utils/Spinner";

const TopicSelection = () => {
  const { data, error, isLoading } = useFetch("/topics");
  const [selections, setSelections] = useState([]);
  const navigate = useNavigate();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  console.log(data);

  const addTopic = (topic) => {
    setSelections([...selections, topic]);
  };

  const removeTopic = (topic) => {
    setSelections(selections.filter((item) => item !== topic));
  };

  const selectTopic = (topic) => {
    if (selections.includes(topic)) {
      removeTopic(topic);
    } else {
      addTopic(topic);
    }
  };

  console.log(selections);

  const getSelections = () => {
    if (selections.length < 5) {
      toast.error("Please select at least 5 topics");
      return;
    }
    navigate(`/topics?query=${selections}`);
  };

  return (
    <div className="topic py-4">
      <Container>
        <h1 className="text-start fs-4 mb-4">
          Select The Topics That Interests You
        </h1>
        {data.topics.length > 0 ? (
          <>
            <div className="topic-selectionBg p-3 p-lg-4 rounded-4 shadow-lg">
              <Row className="py-2">
                {data.topics.map((topic) => (
                  <Col key={topic._id} xs={12} md={3} lg={4} xl={3}>
                    <div
                      className="position-relative mb-1"
                      onClick={() => selectTopic(topic.name)}
                    >
                      <Image
                        src={topic.image}
                        alt="topicname"
                        className="rounded-4 object-fit-cover cursor"
                        style={{ height: "180px", width: "100%" }}
                      />
                      {selections.includes(topic.name) ? (
                        <IoRadioButtonOnOutline
                          className="text-white select"
                          size="20px"
                        />
                      ) : (
                        <IoRadioButtonOffSharp
                          className="text-white select"
                          size="20px"
                        />
                      )}
                    </div>
                    <p className="text-center">{topic.name}</p>
                  </Col>
                ))}
              </Row>
              <p>Select Up To 5 or More Topics</p>
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <Button
                variant="light"
                className="rounded-4"
                style={{ minWidth: "170px" }}
                onClick={getSelections}
              >
                Continue
              </Button>
            </div>
          </>
        ) : (
          <p className="text-white"> Unable to get topics. Try again</p>
        )}
      </Container>
    </div>
  );
};

export default TopicSelection;
