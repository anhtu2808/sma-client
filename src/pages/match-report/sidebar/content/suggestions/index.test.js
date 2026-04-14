import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Suggestions from "./index";

jest.mock("./SuggestionCard", () => ({ suggestion, onRegenerate }) => (
  <button type="button" aria-label="Regenerate suggestion" onClick={() => onRegenerate?.(suggestion?.id)}>
    Regenerate
  </button>
));

describe("Suggestions", () => {
  it("regenerates the clicked suggestion by id", async () => {
    const onRegenerateSuggestion = jest.fn();

    render(
      <Suggestions
        itemKey={11}
        suggestions={[
          { id: 3, suggestion: "Improve impact wording" },
          { id: 4, suggestion: "Add measurable outcome" },
        ]}
        isFocused={false}
        onRegenerateSuggestion={onRegenerateSuggestion}
      />
    );

    await userEvent.click(screen.getAllByRole("button", { name: /regenerate suggestion/i })[1]);

    expect(onRegenerateSuggestion).toHaveBeenCalledWith(4);
  });
});
