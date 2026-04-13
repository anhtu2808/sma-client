import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockEditor;
let mockPollingCallback;
let mockSetIntervalSpy;

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockSetMatchingReportData = jest.fn((payload) => ({
  type: "matchingReport/setMatchingReportData",
  payload,
}));
const mockMapEvaluationToStore = jest.fn();
const mockMapSuggestionsToStore = jest.fn();

const mockUseGetResumeQuery = jest.fn();
const mockUseGetOrCreateEnhancementQuery = jest.fn();
const mockUseGenerateEnhancementSuggestionMutation = jest.fn();
const mockUseLazyGetEnhancementSuggestionQuery = jest.fn();
const mockUseUpdateEnhancementContentMutation = jest.fn();
const mockUseReScoreEnhancementMutation = jest.fn();
const mockUseLazyGetMatchingStatusQuery = jest.fn();
const mockUseLazyGetMatchingDetailQuery = jest.fn();
const mockUseGetJobByIdQuery = jest.fn();

const mockUpdateContent = jest.fn();
const mockGenerateSuggestion = jest.fn();
const mockTriggerGetSuggestions = jest.fn();
const mockReScoreEnhancement = jest.fn();
const mockTriggerGetStatus = jest.fn();
const mockTriggerGetDetail = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-dom", () => ({
  useLocation: () => ({ state: { resumeId: 11, jobId: 22 } }),
  useNavigate: () => mockNavigate,
  useParams: () => ({ evaluationId: "101", enhancementId: "202" }),
}), { virtual: true });

jest.mock("antd", () => ({
  message: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
  Result: ({ title, subTitle }) => (
    <div>
      <div>{title}</div>
      <div>{subTitle}</div>
    </div>
  ),
}));

jest.mock("@/apis/resumeApi", () => ({
  useGetResumeQuery: (...args) => mockUseGetResumeQuery(...args),
  useGetOrCreateEnhancementQuery: (...args) => mockUseGetOrCreateEnhancementQuery(...args),
  useGenerateEnhancementSuggestionMutation: (...args) =>
    mockUseGenerateEnhancementSuggestionMutation(...args),
  useLazyGetEnhancementSuggestionQuery: (...args) =>
    mockUseLazyGetEnhancementSuggestionQuery(...args),
  useUpdateEnhancementContentMutation: (...args) =>
    mockUseUpdateEnhancementContentMutation(...args),
  useReScoreEnhancementMutation: (...args) => mockUseReScoreEnhancementMutation(...args),
}), { virtual: true });

jest.mock("@/apis/matchingApi", () => ({
  useLazyGetMatchingStatusQuery: (...args) => mockUseLazyGetMatchingStatusQuery(...args),
  useLazyGetMatchingDetailQuery: (...args) => mockUseLazyGetMatchingDetailQuery(...args),
}), { virtual: true });

jest.mock("@/apis/jobApi", () => ({
  useGetJobByIdQuery: (...args) => mockUseGetJobByIdQuery(...args),
}), { virtual: true });

jest.mock("@/store/slices/matchingReportSlice", () => ({
  setMatchingReportData: (...args) => mockSetMatchingReportData(...args),
}), { virtual: true });

jest.mock("@/utils/matchingReportUtils", () => ({
  mapEvaluationToStore: (...args) => mockMapEvaluationToStore(...args),
  mapSuggestionsToStore: (...args) => mockMapSuggestionsToStore(...args),
}), { virtual: true });

jest.mock("@/pages/match-report/sidebar", () => () => <div>Sidebar</div>, { virtual: true });
jest.mock("@/components/Loading", () => () => <div>Loading...</div>, { virtual: true });
jest.mock("@/components/Button", () => ({ children, onClick }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
), { virtual: true });
jest.mock("./EnhancementLoading", () => () => <div>Enhancement loading...</div>);
jest.mock("./ExportEnhancementModal", () => () => <div>Export modal</div>);
jest.mock("./resume-editor", () => {
  const React = require("react");

  return function MockResumeEditor({
    onEditorReady,
    onReScore,
    reScoreStatus,
  }) {
    React.useLayoutEffect(() => {
      onEditorReady?.({ editor: mockEditor });
    }, [onEditorReady]);

    return (
      <div>
        <div data-testid="re-score-status">{reScoreStatus ?? "idle"}</div>
        <button type="button" onClick={onReScore}>
          Trigger Re-score
        </button>
      </div>
    );
  };
});

import { message } from "antd";
import Enhancements from "./index";

const initialSuggestionsResponse = {
  contexts: [{ id: 1, context: "Existing context", details: [], suggestions: [] }],
  criteriaScores: [],
};

const detailResponse = {
  id: 999,
  aiOverallScore: 80,
  criteriaScores: [],
};

const suggestionResponse = {
  contexts: [{ id: 2, context: "Updated context", details: [], suggestions: [] }],
  criteriaScores: [],
};

const mappedEvaluation = {
  data: { source: "evaluation" },
  ui: { activeCriteriaId: 10, expandedItemIds: [], activeDocumentTab: "resume" },
};

const mappedSuggestions = {
  data: { source: "suggestions" },
  ui: { activeCriteriaId: 20, expandedItemIds: [], activeDocumentTab: "resume" },
};

const createResolvedMutation = (value) => ({
  unwrap: () => Promise.resolve(value),
});

const createRejectedMutation = (error = new Error("Request failed")) => ({
  unwrap: () => Promise.reject(error),
});

const createDeferredMutation = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    mutation: {
      unwrap: () => promise,
    },
    resolve,
    reject,
  };
};

const flushPromises = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe("Enhancements re-score flow", () => {
  beforeEach(() => {
    mockEditor = {
      getHTML: jest.fn(() => "<p>Edited content</p>"),
    };
    mockPollingCallback = null;
    mockSetIntervalSpy = jest.spyOn(global, "setInterval").mockImplementation((callback) => {
      mockPollingCallback = callback;
      Promise.resolve().then(() => callback());
      return 1;
    });

    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockSetMatchingReportData.mockClear();
    mockMapEvaluationToStore.mockReset().mockReturnValue(mappedEvaluation);
    mockMapSuggestionsToStore.mockReset().mockImplementation((response) => {
      if (response === suggestionResponse) return mappedSuggestions;
      return {
        data: { source: "initial-suggestions" },
        ui: { activeCriteriaId: 1, expandedItemIds: [], activeDocumentTab: "resume" },
      };
    });

    mockUseGetResumeQuery.mockReset().mockReturnValue({
      data: { parseStatus: "FINISH", resumeName: "Resume.pdf" },
      isLoading: false,
      isError: false,
    });
    mockUseGetOrCreateEnhancementQuery.mockReset().mockReturnValue({
      data: { id: 202, content: "<p>Stored content</p>", generateSuggestion: "DONE" },
      isLoading: false,
    });
    mockUseGenerateEnhancementSuggestionMutation.mockReset().mockReturnValue([
      mockGenerateSuggestion,
      { isLoading: false },
    ]);
    mockUseLazyGetEnhancementSuggestionQuery.mockReset().mockReturnValue([
      mockTriggerGetSuggestions,
    ]);
    mockUseUpdateEnhancementContentMutation.mockReset().mockReturnValue([mockUpdateContent]);
    mockUseReScoreEnhancementMutation.mockReset().mockReturnValue([
      mockReScoreEnhancement,
      { isLoading: false },
    ]);
    mockUseLazyGetMatchingStatusQuery.mockReset().mockReturnValue([mockTriggerGetStatus]);
    mockUseLazyGetMatchingDetailQuery.mockReset().mockReturnValue([mockTriggerGetDetail]);
    mockUseGetJobByIdQuery.mockReset().mockReturnValue({
      data: { data: { name: "Frontend Engineer", company: { name: "ACME" } } },
    });

    mockUpdateContent.mockReset().mockReturnValue(createResolvedMutation({}));
    mockGenerateSuggestion.mockReset().mockReturnValue(createResolvedMutation(suggestionResponse));
    mockTriggerGetSuggestions.mockReset().mockReturnValue(createResolvedMutation(initialSuggestionsResponse));
    mockReScoreEnhancement.mockReset().mockReturnValue(createResolvedMutation(999));
    mockTriggerGetStatus.mockReset().mockReturnValue(createResolvedMutation("FINISH"));
    mockTriggerGetDetail.mockReset().mockReturnValue(createResolvedMutation(detailResponse));

    message.success.mockClear();
    message.warning.mockClear();
    message.error.mockClear();
  });

  afterEach(() => {
    mockSetIntervalSpy.mockRestore();
  });

  it("saves the latest editor HTML, refreshes score, then refreshes suggestions after re-score finishes", async () => {
    render(<Enhancements />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Trigger Re-score" })).not.toBeNull()
    );
    await flushPromises();

    mockDispatch.mockClear();
    mockSetMatchingReportData.mockClear();
    mockMapEvaluationToStore.mockClear();
    mockMapSuggestionsToStore.mockClear();
    message.success.mockClear();

    await userEvent.click(screen.getByRole("button", { name: "Trigger Re-score" }));

    expect(mockUpdateContent).toHaveBeenCalledWith({
      id: 202,
      content: "<p>Edited content</p>",
    });
    expect(mockReScoreEnhancement).toHaveBeenCalledWith({ enhancementId: 202 });

    await flushPromises();
    await flushPromises();

    expect(mockMapEvaluationToStore).toHaveBeenCalledWith(detailResponse);
    expect(mockGenerateSuggestion).toHaveBeenCalledWith({ enhancementId: 202 });
    expect(mockMapSuggestionsToStore).toHaveBeenCalledWith(suggestionResponse);
    expect(mockSetMatchingReportData.mock.calls).toEqual([
      [mappedEvaluation],
      [mappedSuggestions],
    ]);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(message.success).toHaveBeenCalledWith("Chấm điểm và cập nhật gợi ý thành công!");
    expect(message.warning).not.toHaveBeenCalled();
  });

  it("keeps the updated score when suggestion regeneration fails and shows a warning toast", async () => {
    mockGenerateSuggestion.mockReturnValue(createRejectedMutation());

    render(<Enhancements />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Trigger Re-score" })).not.toBeNull()
    );
    await flushPromises();

    mockDispatch.mockClear();
    mockSetMatchingReportData.mockClear();
    mockMapEvaluationToStore.mockClear();
    mockMapSuggestionsToStore.mockClear();
    message.warning.mockClear();
    message.success.mockClear();

    await userEvent.click(screen.getByRole("button", { name: "Trigger Re-score" }));

    await flushPromises();
    await flushPromises();

    expect(mockSetMatchingReportData.mock.calls).toEqual([[mappedEvaluation]]);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockMapSuggestionsToStore).not.toHaveBeenCalledWith(suggestionResponse);
    expect(message.warning).toHaveBeenCalledWith(
      "Điểm đã được cập nhật nhưng không thể tạo lại gợi ý"
    );
    expect(message.success).not.toHaveBeenCalled();
  });

  it("does not start re-score when saving the latest editor content fails", async () => {
    mockUpdateContent.mockReturnValue(createRejectedMutation());

    render(<Enhancements />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Trigger Re-score" })).not.toBeNull()
    );
    await flushPromises();

    mockReScoreEnhancement.mockClear();
    mockTriggerGetStatus.mockClear();
    message.error.mockClear();

    await userEvent.click(screen.getByRole("button", { name: "Trigger Re-score" }));
    await flushPromises();

    expect(mockReScoreEnhancement).not.toHaveBeenCalled();
    expect(mockTriggerGetStatus).not.toHaveBeenCalled();
    expect(message.error).toHaveBeenCalledWith(
      "Không thể lưu thay đổi trước khi chấm điểm lại"
    );
  });

  it("ignores duplicate re-score clicks in the same tab while the first request is still in flight", async () => {
    const deferredSave = createDeferredMutation();
    mockUpdateContent.mockReturnValue(deferredSave.mutation);

    render(<Enhancements />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Trigger Re-score" })).not.toBeNull()
    );
    await flushPromises();

    mockReScoreEnhancement.mockClear();

    await userEvent.click(screen.getByRole("button", { name: "Trigger Re-score" }));
    await userEvent.click(screen.getByRole("button", { name: "Trigger Re-score" }));
    await flushPromises();

    expect(mockUpdateContent).toHaveBeenCalledTimes(1);
    expect(mockReScoreEnhancement).not.toHaveBeenCalled();

    await act(async () => {
      deferredSave.resolve({});
      await Promise.resolve();
    });
    await flushPromises();

    expect(mockReScoreEnhancement).toHaveBeenCalledTimes(1);
    expect(mockReScoreEnhancement).toHaveBeenCalledWith({ enhancementId: 202 });
  });
});
