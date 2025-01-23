import AsideBar from "../components/AsideBar";
import Withdrawal from "../components/Withdrawal";
import Transfer from "../components/Transfer";
import Deposit from "../components/Deposit";
import { useState } from "react";
import ChangePin from "../components/ChangePin";

export default function Home() {
  const [showAsideBar, setShowAsideBar] = useState(true);
  const [activeComponent, setActiveComponent] = useState("withdraw");

  return (
    <>
      <section>
        <div className="container-fluid mx-auto lg:flex items-center h-screen justify-between">
          {!showAsideBar && (
            <button
              onClick={() => setShowAsideBar(true)}
              className="absolute  top-4 right-6 block lg:hidden border-none outline-none bg-transparent text-[#29ce70] text-[32px]"
            >
              <i className="ri-menu-line mt-1 inline-block"></i>
            </button>
          )}

          <div className="lg:flex  justify-between w-full items-center">
            <AsideBar
              showAsideBar={showAsideBar}
              setShowAsideBar={setShowAsideBar}
              setActiveComponent={setActiveComponent}
              activeComponent={activeComponent}
            />

            {activeComponent === "withdraw" && <Withdrawal />}
            {activeComponent === "transfer" && <Transfer />}
            {activeComponent === "deposit" && <Deposit />}
            {activeComponent === "changePin" && <ChangePin />}
          </div>
        </div>
      </section>
    </>
  );
}
