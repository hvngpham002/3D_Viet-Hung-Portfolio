/* eslint-disable @typescript-eslint/naming-convention */
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert Component", () => {
  it("renders the alert with correct text", () => {
    render(<Alert text="Test message" type="success" />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders the success strip with alert semantics", () => {
    render(<Alert text="Success message" type="success" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("SENT")).toBeInTheDocument();
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("renders the danger strip with alert semantics", () => {
    render(<Alert text="Danger message" type="danger" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("FAILED")).toBeInTheDocument();
    expect(screen.getByText("Danger message")).toBeInTheDocument();
  });
});
