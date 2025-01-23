import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import SuccessPopUp from "./SuccessPopUp";

export default function ChangePin() {
  const { user } = useUser();
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputHandler = (e) => {
    const filteredFields = emptyFields.filter(
      (field) => field !== e.target.name
    );
    setEmptyFields(filteredFields);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("https://ali-bank.onrender.com/api/users/change-pin", {
        id: user._id,
        pin,
        newPin,
        confirmPin,
      });

      setShowSuccessMessage(true);
      setPin("");
      setNewPin("");
      setConfirmPin("");
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
      <SuccessPopUp
        setShowSuccessMessage={setShowSuccessMessage}
        showSuccessMessage={showSuccessMessage}
        successType={"Pin Change"}
      />
      <section className="changePinSection">
        <h2 className="text-white mb-8 text-center text-[26px] md:text-[30px] heading">
          CHANGE PIN
        </h2>
        <form className="main-form w-full mx-auto" onSubmit={submitHandler}>
          <div>
            <input
              placeholder="Enter Your Current Pin..."
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                inputHandler(e);
              }}
              type="number"
              name="pin"
              className={`${
                emptyFields.includes("pin") ? "emptyField" : ""
              } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none enteredPin`}
            />
          </div>

          <div className="mt-8">
            <input
              placeholder="Enter Your New Pin..."
              value={newPin}
              onChange={(e) => {
                setNewPin(e.target.value);
                inputHandler(e);
              }}
              type="number"
              name="newPin"
              className={`${
                emptyFields.includes("newPin") ? "emptyField" : ""
              } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none enteredPin`}
            />
          </div>

          <div className="mt-8">
            <input
              placeholder="Enter Confirm Pin..."
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                inputHandler(e);
              }}
              type="number"
              name="confirmPin"
              className={`${
                emptyFields.includes("confirmPin") ? "emptyField" : ""
              } w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none enteredPin`}
            />
          </div>

          <div className="button-row flex gap-3 mt-8 w-full">
            <button
              type="submit"
              className="bg-[#29ce70] rounded-[3px] border-none outline-none cursor-pointer h-[62px] md:h-[72px] w-full text-[18px] text-[#f1f1f1] font-semibold"
            >
              {isLoading ? <span className="loader"></span> : "CHANGE PIN"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
