import { useState } from "react";
import NumPad from "./NumPad";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import SuccessPopUp from "./SuccessPopUp";

export default function Deposit() {
  const { user, setUser } = useUser();
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/transections/deposit",
        {
          pin,
          amount,
          id: user._id,
        }
      );

      setUser((prevFields) => ({ ...prevFields, balance: data.balance }));
      setShowSuccessMessage(true);
      setPin("");
      setAmount("");
    } catch (error) {
      if (error.response) {
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

  const handleDelButton = () => {
    setAmount(amount.slice(0, amount.length - 1));
  };

  return (
    <>
      <SuccessPopUp
        setShowSuccessMessage={setShowSuccessMessage}
        showSuccessMessage={showSuccessMessage}
        successType={"Deposited"}
      />
      <section className="transaction-section">
        <h2 className="text-white mb-8 text-center text-[26px] md:text-[30px] heading">
          DEPOSIT
        </h2>
        <form className="main-form mx-auto" onSubmit={submitHandler}>
          <div>
            <input
              placeholder="Enter Your Pin..."
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="number"
              name="pin"
              className="w-full px-3 text-[17px] bg-[#14171b] h-12 text-[#f1f1f1] outline-none enteredPin"
            />
          </div>

          <div className="relative mt-5">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="text"
              maxLength="6"
              className="no-arrows rounded-sm enteredAmount"
              disabled
            />
            <span className="text-[42px] money-icon absolute text-gray-600 font-semibold">
              ₹
            </span>
          </div>

          <NumPad setAmount={setAmount} amount={amount} />

          <div className="button-row flex gap-3 mt-4 w-full">
            <button
              onClick={handleDelButton}
              type="button"
              className="bg-[#ec4a3c] rounded-[3px] border-none outline-none cursor-pointer  h-[62px] md:h-[72px] w-full text-[17px] md:text-[18px] text-[#f1f1f1] font-semibold"
            >
              DEL
            </button>
            <button
              type="submit"
              className="bg-[#29ce70]  h-[62px] md:h-[72px] rounded-[3px] border-none outline-none cursor-pointer  w-full text-[17px] md:text-[18px] text-[#f1f1f1] font-semibold"
            >
              {isLoading ? <span className="loader"></span> : "DEPOSIT"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
