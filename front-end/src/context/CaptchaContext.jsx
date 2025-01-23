import { createContext, useContext, useEffect, useState } from "react";

const CaptchaContext = createContext();

export const useCaptcha = () => {
  return useContext(CaptchaContext);
};

export const CaptchaProvider = ({ children }) => {
  const [captchaCode, setCaptchaCode] = useState();

  const generateCaptchaCode = () => {
    let characters =
      "1234567890poiuytrewqasdfghjkklmnbvcxzQWERTYUIOPLKJHGFDSAZXCVBNM";
    let captcha = "";

    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setCaptchaCode(captcha);
  };

  useEffect(() => {
    generateCaptchaCode();
  }, []);

  return (
    <CaptchaContext.Provider value={{ captchaCode, generateCaptchaCode }}>
      {children}
    </CaptchaContext.Provider>
  );
};
