import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { Modal, Form, Button, Image, Badge, Spinner } from "react-bootstrap";
import { RiQuestionnaireLine } from "react-icons/ri";
import { useFetch } from "../../hooks/useFetch";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import handleAuthError from "../../utils/handleAuthError";

export default function AskQuestion() {
  const { data } = useFetch("/topics");
//const { data: allQuestions, setData } = useFetch("/questions/random");
  const [show, setShow] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const { user, token } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const btnText = isSubmitting ? (
    <Spinner animation="border" size="sm" />
  ) : (
    "Post"
  );

  const uploadImageToCloudinary = async (files) => {
    if (!files || files.length === 0) {
      return null;
    }
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      const data = await axios.post(
        import.meta.env.VITE_CLOUDINARY_UPLOAD_URL,
        formData
      );
      return data;
    } catch (error) {
      toast.error("There was an error uploading your image");
      console.error(error);
      throw error;
    }
  };

  const postQuestion = async (formData) => {
    if (!selectedTopic) {
      toast.error("Please select a topic");
      return;
    }
    let imgUrl = null;

    if (formData.image) {
      //Check if formData.image exists
      const upload = await uploadImageToCloudinary(formData.image);
      const getImgUrl = upload?.data.secure_url;
      imgUrl = getImgUrl;
    }

    const createQuestion = {
      title: formData.title,
      question: formData.question,
      topic: selectedTopic,
      image: imgUrl,
    };
    try {
      const res = await axiosInstance.post("/questions/ask", createQuestion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        toast.success(res.data.msg);
        reset();
        window.location.reload();
      }
      handleClose();
    } catch (error) {
      handleAuthError(error);
    }
  };

  return (
    <div className="mb-4">
      <div
        className="d-flex gap-3 p-3 rounded-3"
        style={{ backgroundColor: "var(--lightGray)" }}
      >
        <Image
          src={user.avatar}
          roundedCircle
          style={{ width: "45px", height: "45px" }}
          alt={user.username}
          className="object-fit-cover"
        />
        <div className="w-100 cursor" onClick={handleShow}>
          <Form.Control
            type="text"
            placeholder="Ask a question"
            className="w-100 bg-transparent border border-secondary rounded-3 text-white"
          />
          <div className="d-flex gap-2 align-items-center text-white mt-2">
            <RiQuestionnaireLine size="20px" />
            <span>Ask</span>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title className="text-white">Ask Question</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="mt-2">
            <p>Select Topic</p>
            {data?.topics?.map((topic) => (
              <Badge
                bg={topic.name === selectedTopic ? "success" : "primary"}
                key={topic._id}
                onClick={() => setSelectedTopic(topic.name)}
                className="me-2 mb-1 cursor"
              >
                {topic.name}
              </Badge>
            ))}
            <div className="mt-3">
              <Form onSubmit={handleSubmit(postQuestion)}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Title</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("title", { required: true })}
                    className={`border border-secondary rounded-3 bg-transparent
                text-white ${errors.title ? "border-danger" : ""}`}
                  />
                  {errors?.title?.type === "required" ? (
                    <span className="text-warning small fw-semibold position-absolute start-25">
                      This field is required!
                    </span>
                  ) : null}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-white">Question</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register("question", { required: true })}
                    className={`border border-secondary rounded-3 bg-transparent
                text-white ${errors.question ? "border-danger" : ""}`}
                  />
                  {errors?.question?.type === "required" ? (
                    <span className="text-warning small fw-semibold position-absolute start-25">
                      This field is required!
                    </span>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-white">Image</Form.Label>
                  <Form.Control type="file" {...register("image")} />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="light"
                    className="mt-4 fw-bold rounded-4"
                    type="submit"
                    style={{ minWidth: "170px" }}
                    disabled={isSubmitting}
                  >
                    {btnText}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
