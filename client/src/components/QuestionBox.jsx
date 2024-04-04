import { Link } from "react-router-dom";
import { Image, Spinner } from "react-bootstrap";
import { format } from "timeago.js";
import { AiFillLike } from "react-icons/ai";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import handleAuthError from "../utils/handleAuthError";
import { useFetch } from "../hooks/useFetch";
import AddComment from "./comments/AddComment";

export default function QuestionBox({
  title,
  question,
  askedBy,
  createdAt,
  image,
  _id,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const { user, token } = useAuth();
  const { data, setData } = useFetch(`/questions/find/${_id}`);

  const handleLike = async () => {
    setIsLiked(true);
    try {
      const res = await axiosInstance.put(`/questions/${_id}/like`, user._id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data);
      const getQuestion = await axiosInstance.get(`/questions/find/${_id}`);
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
        `/questions/${_id}/dislike`,
        user._id,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data);
      const getQuestion = await axiosInstance.get(`/questions/find/${_id}`);
      setData(getQuestion.data);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLiked(false);
    }
  };

  const checkLikesArray = data?.likes.includes(user?._id);

  return (
    <div
      className="py-4 mb-4 rounded-3 shadow text-white"
      style={{ backgroundColor: "var(--lightGray)" }}
    >
      <div className="px-3 mb-3">
        <div className="d-flex gap-2">
          <Image
            src={askedBy.profilePhoto}
            alt={askedBy.username}
            style={{ width: "45px", height: "45px" }}
            roundedCircle
            className="object-fit-cover"
            loading="lazy"
          />
          <div className="text-white">
            <p className="fw-bold mb-0">{askedBy.username}</p>
            <span className="small text-white-50">
              asked: {format(createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="px-3">
          <Link to={`/question/${_id}`}>
            <h1 className="fs-6 text-white">{title}</h1>
            <p className="small text-white-50">{question}</p>
          </Link>
        </div>
        {image && (
          <div style={{ height: "300px" }}>
            <Link to={`/question/${_id}`}>
              <Image src={image} className="w-100 h-100 object-fit-fill" />
            </Link>
          </div>
        )}
        <div className="mt-3 px-3 d-flex justify-content-between">
          <AddComment questionId={_id} />
          {isLiked ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <div className="d-flex align-items-center gap-2 cursor">
              <AiFillLike
                size="20px"
                onClick={checkLikesArray ? handleDisLike : handleLike}
                className={`cursor ${checkLikesArray ? "text-danger" : ""}`}
              />
              <span>{data?.likes.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
