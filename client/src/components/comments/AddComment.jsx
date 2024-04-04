import { useState } from "react";
import { FaRegComments } from "react-icons/fa6";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { IoIosCloseCircleOutline } from "react-icons/io";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import handleAuthError from "../../utils/handleAuthError";
import axiosInstance from "../../utils/axiosInstance";
import { useFetch } from "../../hooks/useFetch";

export default function AddComment({ questionId }) {
  const { data, setData } = useFetch(`/comments/get/${questionId}`);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const { token } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const btnText = isSubmitting ? (
    <Spinner animation="border" size="sm" variant="secondary" />
  ) : (
    "Post"
  );
  const commentLength = data?.map((comments) => comments);

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
        setData(comment.data);
      }
      handleClose();
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
        className="d-flex align-items-center gap-2 cursor"
        onClick={handleShow}
      >
        <FaRegComments size="20px" />
        <span>{commentLength?.length}</span>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body style={{ backgroundColor: "var(--deepGray)" }}>
          <div className="d-flex justify-content-between">
            <p className="">Add Comment</p>
            <IoIosCloseCircleOutline
              color="#ffffff"
              className="cursor"
              size="20px"
              onClick={handleClose}
            />
          </div>
          <Form className="w-100" onSubmit={handleSubmit(submit)} >
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
        </Modal.Body>
      </Modal>
    </>
  );
}
