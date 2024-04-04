import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Spinner from "../utils/Spinner";
import { Image, Form, Button, Spinner as Spin } from "react-bootstrap";
import { format } from "timeago.js";
import { AiFillLike } from "react-icons/ai";
import axiosInstance from "../utils/axiosInstance";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import handleAuthError from "../utils/handleAuthError";
import { FaRegComments } from "react-icons/fa6";
import { useForm } from "react-hook-form";

export default function QuestionDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const { questionId } = useParams();
  const { data, error, isLoading, setData } = useFetch(
    `/questions/find/${questionId}`
  );
  const { data: comments, setData: setComments } = useFetch(
    `/comments/get/${questionId}`
  );
  const { data: question } = useFetch(`/questions/find/${data?._id}`);
  const { user, token } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-white">{error}</p>;
  }

  const btnText = isSubmitting ? (
    <Spinner animation="border" size="sm" variant="secondary" />
  ) : (
    "Post"
  );

  const handleLike = async () => {
    setIsLiked(true);
    try {
      const res = await axiosInstance.put(
        `/questions/${data._id}/like`,
        user._id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data);
      const getQuestion = await axiosInstance.get(
        `/questions/find/${question?._id}`
      );
      setData(getQuestion.data);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLiked(false);
    }
  };

  const handleDisLike = async () => {
    setIsLiked(true);
    try {
      const res = await axiosInstance.put(
        `/questions/${data._id}/dislike`,
        user._id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data);
      const getQuestion = await axiosInstance.get(
        `/questions/find/${question?._id}`
      );
      setData(getQuestion.data);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLiked(false);
    }
  };

  const checkLikesArray = data?.likes?.includes(user?._id);

  const postComment = async (formData) => {
    try {
      const res = await axiosInstance.post(
        `/comments/create/${questionId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.msg);
        reset();
        const comment = await axiosInstance.get(`/comments/get/${questionId}`);
        setComments(comment.data);
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const submit = (data) => {
    postComment(data);
  };

  return (
    <>
      <div
        className="py-4 mb-4 rounded-3 shadow text-white"
        style={{ backgroundColor: "var(--lightGray)" }}
      >
        <div className="px-3 mb-3">
          <Link
            to={`/profile/${data?.askedBy?.username}`}
            className="d-flex gap-2"
          >
            <Image
              src={data?.askedBy?.profilePhoto}
              alt={data?.askedBy?.username}
              style={{ width: "45px", height: "45px" }}
              roundedCircle
              className="object-fit-cover"
            />
            <div className="text-white">
              <p className="fw-bold mb-0">{data?.askedBy?.username}</p>
              <span className="small text-white-50">
                asked: {format(data.createdAt)}
              </span>
            </div>
          </Link>
        </div>
        <div>
          <div className="px-3">
            <Link to={`/question/${data._id}`}>
              <h1 className="fs-6 text-white">{data.title}</h1>
              <p className="small text-white-50">{data.question}</p>
            </Link>
          </div>
          {data.image && (
            <div style={{ height: "100%" }}>
              <Link to={`/question/${data._id}`}>
                <Image
                  src={data.image}
                  className="w-100 h-100 object-fit-cover"
                />
              </Link>
            </div>
          )}
          <div className="mt-3 px-3 d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2 cursor">
              <FaRegComments size="20px" />
              <span>{comments?.length}</span>
            </div>
            {isLiked ? (
              <Spin animation="border" size="sm" />
            ) : (
              <div className="d-flex align-items-center gap-2 cursor">
                <AiFillLike
                  size="20px"
                  onClick={checkLikesArray ? handleDisLike : handleLike}
                  className={`cursor ${checkLikesArray ? "text-danger" : ""}`}
                />
                <span>{data?.likes?.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {user && (
        <Form className="w-100" onSubmit={handleSubmit(submit)}>
          <Form.Group
            className="mt-3 w-100"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter comment here"
              className={`border border-secondary rounded-3 bg-transparent
                text-white ${errors.username ? "border-danger" : ""}`}
              {...register("comment", { required: true })}
            />
            {errors?.comment?.type === "required" ? (
              <span className="text-danger small fw-semibold position-absolute start-25">
                This field is required!
              </span>
            ) : null}
          </Form.Group>
          <Button
            variant="light"
            className="mt-4 fw-bold rounded-4"
            type="submit"
            style={{ minWidth: "170px" }}
            disabled={isSubmitting}
          >
            {btnText}
          </Button>
        </Form>
      )}
      <p className="mt-4">Comments</p>
      {comments?.length > 0 ? (
        <>
          <div
            className="py-4 mb-4 rounded-3 shadow text-white px-3"
            style={{ backgroundColor: "var(--lightGray)" }}
          >
            {comments?.map((comment) => (
              <div key={comment._id} className="d-flex gap-2 mb-3">
                <Image
                  src={comment?.askedBy?.profilePhoto}
                  alt="user"
                  style={{ width: "35px", height: "35px" }}
                  roundedCircle
                  className="object-fit-cover"
                />
                <div className="flex-grow-1">
                  <div className="d-flex flex-grow-1 gap-2">
                    <p className="fw-bold small mb-0">
                      {comment?.askedBy?.username}
                    </p>
                    <span className="small flex-grow-1">{comment.comment}</span>
                  </div>
                  <div className="d-flex gap-4 text-white-50">
                    <span className="small">{format(comment.createdAt)}</span>
                    <span className="small">{comment.likeCount} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-white">No answers yet.</p>
      )}
    </>
  );
}
