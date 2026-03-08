import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => ({
    RouterProvider: () => <div>router-provider</div>,
  }),
  { virtual: true }
);

jest.mock(
  "@/routes",
  () => ({
    routes: {},
  }),
  { virtual: true }
);

import App from "./App";

test("renders the app router", () => {
  render(<App />);

  expect(screen.getByText("router-provider")).not.toBeNull();
});
