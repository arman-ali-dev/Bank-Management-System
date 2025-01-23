import { createPortal } from "react-dom";
import { useStatement } from "./context/StatementContext";

export default function Modal({ setShowStatements }) {
  const statements = useStatement();

  return createPortal(
    <>
      <div className="back-view">
        <div className="modal ">
          <button
            onClick={() => setShowStatements(false)}
            className="absolute flex justify-center items-center closeBtn bg-transparent text-white text-[17px] md:text-[22px] h-8 md:h-10 w-full font-semibold border-none outline-none cursor-pointer -top-8 md:-top-10 z-50"
          >
            <i className="ri-close-line"></i>
          </button>

          <div className="overflow-y-scroll h-full table-main">
            <table
              width="100%"
              className="text-white statement-table "
              border="1"
            >
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {statements.map((elem, index) => {
                  return (
                    <tr key={index}>
                      <td>{elem.transactionID}</td>
                      <td>{elem.date}</td>
                      <td>{elem.type}</td>
                      <td>{elem.amount}</td>
                      <td>{elem.balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("modal-root")
  );
}
