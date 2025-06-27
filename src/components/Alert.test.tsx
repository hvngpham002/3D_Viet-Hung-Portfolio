/* eslint-disable @typescript-eslint/naming-convention */
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert Component", () => {
  it("renders the alert with correct text", () => {
    render(<Alert text="Test message" type="success" />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("applies appropriate styling based on alert type", () => {
    // Test for success type
    const { rerender } = render(
      <Alert text="Success message" type="success" />
    );
    let alertElement = screen.getByText("Success message").closest("div");
    expect(alertElement).toHaveClass("bg-blue-800");
    expect(alertElement).not.toHaveClass("bg-red-800");

    // Test for danger type
    rerender(<Alert text="Danger message" type="danger" />);
    alertElement = screen.getByText("Danger message").closest("div");
    expect(alertElement).toHaveClass("bg-red-800");
    expect(alertElement).not.toHaveClass("bg-blue-800");
  });
});
