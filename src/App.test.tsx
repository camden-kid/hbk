import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("App", () => {
  it("should show the correct header", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await screen.findByRole("banner");

    expect(screen.getByRole("banner")).toHaveTextContent("Random cats");
  });
});
