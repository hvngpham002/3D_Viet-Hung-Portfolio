import { useState } from "react";

type alertType = "danger" | "success";
type alertProps = { text: string; type?: alertType };
type alertState = { show: boolean; text: string; type: alertType };

const useAlert = () => {
  const [alert, setAlert] = useState<alertState>({
    show: false,
    text: "",
    type: "danger",
  });

  const showAlert = ({ text, type = "danger" }: alertProps) => {
    setAlert({
      show: true,
      text,
      type,
    });
  };

  const hideAlert = () => {
    setAlert({
      show: false,
      text: "",
      type: "danger",
    });
  };

  return { alert, showAlert, hideAlert };
};

export default useAlert;
