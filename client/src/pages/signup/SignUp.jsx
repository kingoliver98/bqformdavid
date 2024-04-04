import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../../utils/Spinner";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import handleAuthError from "../../utils/handleAuthError";

const SignUp = () => {
  const { isSubmitting, setIsSubmitting, setToken, token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignUp = async (formData) => {
    setIsSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/auth/signup", formData);
      setToken(data.token);
      localStorage.setItem("token", JSON.stringify(data.token));
      toast.success(`Welcome ${data.user.username}`);
      navigate("/topic-selection");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submit = (data) => {
    handleSignUp(data);
  };

  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, token]);

  const btnText = isSubmitting ? <Spinner /> : "Sign Up";

  return (
    <div className="bg-black d-flex flex-column justify-content-center right-side text-center">
      <h2>BQ</h2>
      <h2>Welcome to BQ!</h2>
      <p>Join our Vibrant community and unlock a world of possibilites!</p>

      <form
        onSubmit={handleSubmit(submit)}
        className="d-flex flex-column gap-4 px-4 text-start"
      >
        <div className=" position-relative">
          <label htmlFor="" className="fw-semibold">
            USERNAME
          </label>
          <input
            {...register("username", { required: true })}
            type="text"
            className={`w-100 border-0 border-bottom bg-black  ${
              errors.username ? "border-danger" : "border-secondary"
            }`}
            placeholder="John.Doe200"
          />
          {errors?.username?.type === "required" ? (
            <span className="text-danger fw-semibold position-absolute end-0">
              This field is required!
            </span>
          ) : null}
        </div>
        <div className=" position-relative">
          <label htmlFor="" className="fw-semibold">
            EMAIL
          </label>
          <input
            {...register("email", { required: true })}
            type="text"
            className={`w-100 border-0 border-bottom bg-black  ${
              errors.email ? "border-danger" : "border-secondary"
            }`}
            placeholder="John.Doe200@gmail.com"
          />
          {errors?.email?.type === "required" ? (
            <span className="text-danger fw-semibold position-absolute end-0">
              This field is required!
            </span>
          ) : null}
        </div>
        <div className=" position-relative">
          <label htmlFor="" className="fw-semibold">
            PASSWORD
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            className={`w-100 border-0 border-bottom bg-black  ${
              errors.password ? "border-danger" : "border-secondary"
            }`}
            placeholder="*************"
          />
          {errors?.password?.type === "required" ? (
            <span className="text-danger fw-semibold position-absolute end-0">
              This field is required!
            </span>
          ) : null}
        </div>
        <div className=" position-relative">
          <label htmlFor="" className="fw-semibold">
            CONFIRM PASSWORD
          </label>
          <input
            {...register("confirmPassword", {
              required: true,
              validate: (inputValue) => {
                return getValues("password") === inputValue;
              },
            })}
            type="password"
            className={`w-100 border-0 border-bottom bg-black  ${
              errors.confirmPassword ? "border-danger" : "border-secondary"
            }`}
            placeholder="*************"
          />
          {errors?.confirmPassword?.type === "required" ? (
            <span className="text-danger fw-semibold position-absolute end-0">
              This field is required!
            </span>
          ) : null}
          {errors?.confirmPassword?.type === "validate" ? (
            <span className="text-danger fw-semibold position-absolute end-0">
              Password does not match!
            </span>
          ) : null}
        </div>
        <button
          disabled={isSubmitting}
          className="btn bg-white rounded-pill fw-bold py-2 text-black"
        >
          {btnText}
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            className=" text-decoration-none text-white fw-semibold"
            to="/signin"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
