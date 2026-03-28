# BA Agent Memory

## Match Report Architecture
- Step 1: `/match-report/:evaluationId` - Overview (sidebar + main content)
- Step 2: `/match-report/:evaluationId/enhancements` - TipTap editor + sidebar
- Shared Redux slice: `matchingReportSlice.js` - holds `data` (EvaluationData) + `ui` state
- Shared component: `MatchReportSidebar` used in both steps
- EditorContext provides `fixInEditor` + `fixingDetailId` for Step 2

## Key Data Types (matchingReportUtils.tsx)
- EvaluationData: aiOverallScore, matchLevel, summary, strengths, weakness, criteriaScores[]
- CriteriaScore: id, criteriaName, aiScore, details[]
- DetailItem: id, label, status (MATCHED/MISSING/FIXED), description, context, isFixed, suggestions[]
- SuggestionItem: id, suggestion

## ProseMirror Decoration Pattern
- SuggestionHighlight extension uses Decoration.inline with CSS classes
- useEditorHighlights syncs Redux -> decorations via setHighlights command
- findTextInDoc utility maps context strings to doc positions

## Existing Components Worth Reusing
- ScoreCard (sidebar/header/ScoreCard.js): SVG ring, 64px, uses useAnimatedScore hook
- Suggestions component: renders SuggestionCard list with auto_awesome header
- SuggestionCard: Copy + Fix in Editor + Regenerate; uses EditorContext

## UI Conventions
- Cards: rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm
- Icons: material-icons-round
- Colors: primary=#F97316, emerald for positive, red for negative, amber for warnings
- Tailwind CSS 3 + antd 6
