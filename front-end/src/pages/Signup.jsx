import { useState } from "react";
import { useCaptcha } from "../context/CaptchaContext";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const { captchaCode, generateCaptchaCode } = useCaptcha();
  const { setUser } = useUser();

  const [userInfo, setUserInfo] = useState({
    account_holder_name: "",
    phone_number: "",
    pin: "",
    confirm_pin: "",
    captcha_code: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [emptyFields, setEmptyFields] = useState([]);
  const [accountNumber, setAccountNumber] = useState(undefined);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
        "http://localhost:8000/user/register",
        userInfo
      );

      setUser(data.user);
      Cookies.set("auth-token", data.token, { expires: 30 });
      setAccountNumber(data.user.accountNumber);
      setShowSuccessMessage(true);
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
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className={showSuccessMessage ? "bg-blur" : ""}>
        <div className="container mx-auto">
          <div className="main relative">
            <div className="text-center heading">
              <h2 className="text-[#f1f1f1] text-[28px] mt-5">Sign Up</h2>
            </div>

            <form
              onSubmit={submitHandler}
              className="px-7 pt-6 flex flex-col justify-between"
            >
              <div>
                <label
                  htmlFor="account_holder_name"
                  className="block ml-1 text-[#f1f1f1] mb-1"
                >
                  Name
                </label>
                <input
                  value={userInfo.account_holder_name}
                  onChange={inputHandler}
                  type="text"
                  name="account_holder_name"
                  className={`${
                    emptyFields.includes("account_holder_name")
                      ? "emptyField"
                      : ""
                  } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none`}
                />
              </div>

              <div className="mt-3 md:mt-10 lg:mt-7 xl:mt-5">
                <label
                  htmlFor="phone_number"
                  className="block ml-1 text-[#f1f1f1] mb-1"
                >
                  Phone Number
                </label>
                <input
                  value={userInfo.phone_number}
                  onChange={inputHandler}
                  type="number"
                  name="phone_number"
                  className={`${
                    emptyFields.includes("phone_number") ? "emptyField" : ""
                  } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none`}
                />
              </div>

              <div className="mt-3 md:mt-10 lg:mt-7 xl:mt-5">
                <label htmlFor="pin" className="block ml-1 text-[#f1f1f1] mb-1">
                  Create Pin
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

              <div className="mt-3 md:mt-10 lg:mt-7 xl:mt-5">
                <label
                  htmlFor="confirm_pin"
                  className="block ml-1 text-[#f1f1f1] mb-1"
                >
                  Confirm Pin
                </label>
                <input
                  value={userInfo.confirm_pin}
                  onChange={inputHandler}
                  type="password"
                  name="confirm_pin"
                  className={`${
                    emptyFields.includes("confirm_pin") ? "emptyField" : ""
                  } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none`}
                />
              </div>

              <div
                style={{ userSelect: "none" }}
                className=" flex justify-center items-center relative text-[#f1f1f1] captcha_code_main h-16 md:h-24 lg:h-20  mt-5 md:mt-10 lg:mt-7 xl:mt-5 rounded-[3px] bg-[#14171b]"
              >
                <h2>{captchaCode}</h2>
                <button
                  onClick={generateCaptchaCode}
                  type="button"
                  className="text-[22px] lg:text-[32px] h-full absolute top-0 right-0 w-14 md:w-20 border-none outline-none text-[#f1f1f1]  flex justify-center items-center cursor-pointer refresh_btn bg-[#2a3643]"
                >
                  <i className="ri-refresh-line"></i>
                </button>
              </div>

              <div className="mt-3 md:mt-10 lg:mt-7 xl:mt-5">
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

              <div className="absolute  bottom-0 w-full left-0 text-right">
                <Link
                  className="text-blue-800 text-[15px] mr-7 inline-block underline "
                  to="/login"
                >
                  i have already an account!
                </Link>
                <button
                  type="submit"
                  className="w-full submit_btn bg-[#2a3643] cursor-pointer h-[58px] text-[#f1f1f1] font-semibold border-none text-[20px]"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loader"></span> : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div
        className={`success_message_box register_success_message_box  text-center ${
          showSuccessMessage ? "show" : "hide"
        }`}
      >
        <img src="/images/tick.png" alt="" height="85px" />
        <h3 className="text-[#14171b]">Registration Successfully!</h3>
        <p>Your Account Number: {accountNumber}</p>
        <button
          onClick={() => {
            setShowSuccessMessage(false);
            navigate("/");
          }}
          className="bg-[#2a3643] outline-none border-none"
        >
          OK
        </button>
      </div>
    </>
  );
}
