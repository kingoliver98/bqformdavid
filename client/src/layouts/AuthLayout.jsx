import officeImg from "../assets/images/office-image.png";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="text-white d-md-flex align-items-md-center">
      <div className="w-50 d-none d-md-block">
        <img className="office-img" src={officeImg} alt="" />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
