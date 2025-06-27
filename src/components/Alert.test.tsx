/* eslint-disable @typescript-eslint/naming-convention */
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert Component", () => {
  it("renders the alert with correct text", () => {
    render(<Alert text="Test alert message" type="success" />);
    expect(screen.getByText("Test alert message")).toBeInTheDocument();
  });

  it("applies appropriate styling based on alert type", () => {
    render(<Alert text="Success message" type="success" />);
    const alertElement = screen.getByText("Success message").closest("div");
    expect(alertElement).toHaveClass("bg-blue-800");

    render(<Alert text="Danger message" type="danger" />);
    const dangerAlertElement = screen
      .getByText("Danger message")
      .closest("div");
    expect(dangerAlertElement).toHaveClass("bg-red-800");
  });
});
