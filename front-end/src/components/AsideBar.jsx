import { useState } from "react";
import { useUser } from "../context/UserContext";
import Modal from "../Modal";

export default function AsideBar({
  setActiveComponent,
  activeComponent,
  showAsideBar,
  setShowAsideBar,
}) {
  const { user, logoutHandler } = useUser();

  const [showStatements, setShowStatements] = useState(false);

  const handleSetActiveComponent = (component) => {
    return function () {
      setActiveComponent(component);
    };
  };

  return (
    <>
      <aside
        className={`flex flex-col px-7 lg:px-0 justify-between h-screen  w-screen xl:h-screen mt-0 ${
          showAsideBar ? "showAsideBar" : "hideAsideBar"
        }`}
      >
        {/* Close Button */}
        {showAsideBar && (
          <button
            onClick={() => setShowAsideBar(false)}
            className="block lg:hidden absolute top-4 border-none right-5 outline-none bg-transparent text-[#ec4a3c] text-[34px]"
          >
            <i className="ri-close-line"></i>
          </button>
        )}

        {/* User Details Section */}
        <div className="user_details">
          <div>
            <h2 className="text-[#f1f1f1] text-[22px] lg:text-[26px] name">
              {user?.name}
            </h2>
            <p className="text-gray-500 text-[12px] lg:text-[13px] -mt-0.5 uppercase">
              Account Holder
            </p>
          </div>

          <div className="mt-7">
            <h2 className="text-[#f1f1f1] text-[22px] lg:text-[26px] name">
              {user?.accountNumber}
            </h2>
            <p className="text-gray-500 text-[12px] lg:text-[13px] -mt-0.5 uppercase">
              Account Number
            </p>
          </div>

          <div className="balance mt-7">
            <h2 className="text-[#29ce70] text-[22px] lg:text-[26px]">
              {user?.balance} ₹
            </h2>
            <p className="text-gray-500 text-[12px] lg:text-[13px] -mt-0.5 uppercase">
              Balance
            </p>
          </div>

          <div className="mt-7">
            <button
              onClick={logoutHandler}
              className="bg-[#ec4a3c]  py-2.5 px-5 cursor-pointer uppercase font-semibold border-none logoutBtn text-white text-[17px]"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Menu Section */}
        <div>
          <ul>
            <li
              className={`${
                activeComponent === "withdraw" && "active"
              } text-gray-500 text-[18px] lg:text-[21px] font-semibold cursor-pointer`}
              onClick={() => {
                handleSetActiveComponent("withdraw")();
                setShowAsideBar(false);
              }}
            >
              Cash Withdrawal
            </li>

            <li
              className={`${
                activeComponent === "deposit" && "active"
              } mt-5 lg:mt-8 text-gray-500 text-[18px] lg:text-[21px] font-semibold cursor-pointer`}
              onClick={() => {
                handleSetActiveComponent("deposit")();
                setShowAsideBar(false);
              }}
            >
              Cash Deposit
            </li>

            <li
              className={`${
                activeComponent === "transfer" && "active"
              } mt-5 lg:mt-8 text-gray-500 text-[18px] lg:text-[21px] font-semibold cursor-pointer`}
              onClick={() => {
                handleSetActiveComponent("transfer")();
                setShowAsideBar(false);
              }}
            >
              Cash Transfer
            </li>

            <li
              onClick={() => setShowStatements(true)}
              className="mt-5 lg:mt-8 text-gray-500 text-[18px] lg:text-[21px] font-semibold cursor-pointer"
            >
              Check Statement
            </li>

            {showStatements && <Modal setShowStatements={setShowStatements} />}

            <li
              className={`${
                activeComponent === "changePin" && "active"
              } mt-5 lg:mt-8 text-gray-500 text-[18px] lg:text-[21px] font-semibold cursor-pointer`}
              onClick={() => {
                handleSetActiveComponent("changePin")();
                setShowAsideBar(false);
              }}
            >
              Change Pin
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
