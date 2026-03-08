import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SuggestModal from "./index";

describe("SuggestModal", () => {
  it("renders nothing when there are no suggestions", () => {
    const { container } = render(<SuggestModal suggestions={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("invokes the provided action handlers", async () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
      <SuggestModal
        suggestions={["Improve this bullet point"]}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await userEvent.click(screen.getByRole("button", { name: /mark as fixed/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
