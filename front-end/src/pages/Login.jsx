import { useState } from "react";
import { useCaptcha } from "../context/CaptchaContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { captchaCode, generateCaptchaCode } = useCaptcha();
  const { setUser } = useUser();

  const [userInfo, setUserInfo] = useState({
    account_number: "",
    pin: "",
    captcha_code: "",
  });
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputHandler = (e) => {
    const filteredFields = emptyFields.filter((elem) => elem !== e.target.name);
    setEmptyFields(filteredFields);

    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (captchaCode !== userInfo.captcha_code && userInfo.captcha_code) {
      return toast.error("Incorrect captcha code!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }

    try {
      const { data } = await axios.post(
        "https://ali-bank.onrender.com/api/users/login",
        userInfo
      );

      setUser(data.user);
      Cookies.set("auth-token", data.token, { expires: 30 });
      navigate("/");
    } catch (error) {
      if (error.response) {
        if (error.response.data.emptyFields) {
          setEmptyFields(error.response.data.emptyFields);
        }

        return toast.error(error.response.data.msg, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section>
        <div className="container mx-auto">
          <div className="main relative">
            <div className="text-center heading">
              <h2 className="text-[#f1f1f1] text-[28px] mt-5">Log In</h2>
            </div>

            <form
              onSubmit={submitHandler}
              className="px-7 pt-6 flex flex-col justify-between"
            >
              <div>
                <label
                  htmlFor="account_number"
                  className="block ml-1 text-[#f1f1f1] mb-1"
                >
                  Account Number
                </label>
                <input
                  value={userInfo.account_number}
                  onChange={inputHandler}
                  type="number"
                  name="account_number"
                  className={`${
                    emptyFields.includes("account_number") ? "emptyField" : ""
                  } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none`}
                />
              </div>

              <div className=" mt-3 md:mt-10 lg:mt-7 ">
                <label htmlFor="pin" className="block ml-1 text-[#f1f1f1] mb-1">
                  Pin
                </label>
                <input
                  value={userInfo.pin}
                  onChange={inputHandler}
                  type="password"
                  name="pin"
                  className={`${
                    emptyFields.includes("pin") ? "emptyField" : ""
                  } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none`}
                />
              </div>

              <div
                style={{ userSelect: "none" }}
                className="flex h-16 md:h-24 lg:h-20  mt-5 md:mt-10 lg:mt-7 justify-center items-center  text-center relative text-[#f1f1f1] captcha_code_main   rounded-[3px] bg-[#14171b]"
              >
                <h2>{captchaCode}</h2>
                <button
                  onClick={generateCaptchaCode}
                  type="button"
                  className="h-full absolute top-0 right-0 w-14 md:w-20 border-none outline-none text-[#f1f1f1] text-[22px] lg:text-[32px] flex justify-center items-center cursor-pointer refresh_btn bg-[#2a3643]"
                >
                  <i className="ri-refresh-line"></i>
                </button>
              </div>

              <div className=" mt-3 md:mt-10 lg:mt-7 ">
                <label
                  htmlFor="captcha_code"
                  className="block ml-1 text-[#f1f1f1] mb-1"
                >
                  Captcha Code
                </label>
                <input
                  value={userInfo.captcha_code}
                  onChange={inputHandler}
                  type="text"
                  name="captcha_code"
                  className={`${
                    emptyFields.includes("captcha_code") ? "emptyField" : ""
                  } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none`}
                />
              </div>

              <div className="absolute text-right bottom-0 w-full left-0">
                <Link
                  className="text-blue-800 text-[15px] mr-7 inline-block underline "
                  to="/signup"
                >
                  create an account?
                </Link>
                <button
                  type="submit"
                  className="w-full submit_btn bg-[#2a3643] cursor-pointer h-[58px] text-[#f1f1f1] font-semibold border-none text-[20px]"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loader"></span> : "Log In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
