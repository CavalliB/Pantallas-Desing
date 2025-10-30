import * as React from "react";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";

type BackButtonProps = {
  to?: string;
  children?: React.ReactNode;
};

export default function BackButton({ to, children }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button variant="outlined" color="primary" onClick={handleClick}>
      {children ?? "Volver"}
    </Button>
  );
}
