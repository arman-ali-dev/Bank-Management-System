export default function NumPad({ setAmount, amount }) {
  const numpadButtons = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [".", 0, "00"],
  ];

  return (
    <>
      <div className="num_pad">
        {numpadButtons.map((elem, index) => {
          return (
            <div key={index} className="button-row gap-3 flex mt-4">
              {elem.map((num, i) => {
                return (
                  <button
                    key={i}
                    onClick={(e) => setAmount((amount += e.target.textContent))}
                    type="button"
                    className="bg-[#2a3643] rounded-[3px] border-none outline-none cursor-pointer h-[62px] md:h-[72px] w-full text-[22px] md:text-[24px] text-[#f1f1f1] font-semibold"
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
