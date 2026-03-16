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
    const onRegenerateSuggestion = jest.fn();

    render(
      <SuggestModal
        suggestions={[{ id: 7, suggestion: "Improve this bullet point" }]}
        onCancel={onCancel}
        onConfirm={onConfirm}
        onRegenerateSuggestion={onRegenerateSuggestion}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /regenerate suggestion/i }));
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await userEvent.click(screen.getByRole("button", { name: /mark as fixed/i }));

    expect(onRegenerateSuggestion).toHaveBeenCalledWith(7);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
