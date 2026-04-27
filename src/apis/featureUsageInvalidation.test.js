import fs from "fs";
import path from "path";

const readApiSource = (filename) =>
  fs.readFileSync(path.join(__dirname, filename), "utf8");

describe("Feature usage cache invalidation", () => {
  test("regenerateSuggestion invalidates FeatureUsage", () => {
    const source = readApiSource("matchingApi.js");

    expect(source).toMatch(
      /regenerateSuggestion:\s*builder\.mutation\(\{[\s\S]*?invalidatesTags:\s*\["FeatureUsage"\]/
    );
  });

  test("suggestion chat mutations invalidate FeatureUsage", () => {
    const source = readApiSource("resumeApi.js");

    expect(source).toMatch(
      /startSuggestionConversation:\s*builder\.mutation\(\{[\s\S]*?invalidatesTags:\s*\["FeatureUsage"\]/
    );
    expect(source).toMatch(
      /sendSuggestionConversationAnswer:\s*builder\.mutation\(\{[\s\S]*?invalidatesTags:\s*\["FeatureUsage"\]/
    );
    expect(source).toMatch(
      /skipSuggestionConversation:\s*builder\.mutation\(\{[\s\S]*?invalidatesTags:\s*\["FeatureUsage"\]/
    );
  });
});
