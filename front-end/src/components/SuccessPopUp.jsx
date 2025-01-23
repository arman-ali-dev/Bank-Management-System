export default function SuccessPopUp({
  successType,
  setShowSuccessMessage,
  showSuccessMessage,
}) {
  return (
    <>
      <div
        className={`success_message_box text-center ${
          showSuccessMessage ? "show" : "hide"
        }`}
      >
        <img src="/images/tick.png" alt="Success" className="h-[85px]" />

        <h3 className="text-[#14171b] successText">
          {successType} Successfully!
        </h3>

        <button
          type="button"
          onClick={() => setShowSuccessMessage(false)}
          className="bg-[#2a3643] outline-none border-none"
        >
          OK
        </button>
      </div>
    </>
  );
}
