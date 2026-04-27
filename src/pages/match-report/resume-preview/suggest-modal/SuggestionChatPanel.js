import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  useStartSuggestionConversationMutation,
  useSendSuggestionConversationAnswerMutation,
  useSkipSuggestionConversationMutation,
} from '@/apis/resumeApi';
import { addSuggestionToContext } from '@/store/slices/matchingReportSlice';
import { getErrorMessage } from '@/constant/attachment';
import toastMessage from '@/utils/toastMessage';

const QUESTION_KIND_LABELS = {
  YES_NO: 'Yes / No',
  DESCRIBE: 'Describe',
  QUANTIFY: 'Quantify',
  PROFICIENCY: 'Proficiency',
};

const SuggestionChatPanel = ({
  contextId,
  enhancementId: enhancementIdProp,
  initialConversation = null,
  onCompleted,
  onSkipped,
}) => {
  const params = useParams();
  const dispatch = useDispatch();
  const enhancementId = enhancementIdProp ?? Number(params.enhancementId);

  const [startConversation, { isLoading: isStarting }] = useStartSuggestionConversationMutation();
  const [sendAnswer, { isLoading: isSending }] = useSendSuggestionConversationAnswerMutation();
  const [skipConversation, { isLoading: isSkipping }] = useSkipSuggestionConversationMutation();

  const [conversation, setConversation] = useState(initialConversation);
  const [answerDraft, setAnswerDraft] = useState('');
  const startedKeyRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const bottomAnchorRef = useRef(null);

  useEffect(() => {
    setConversation(initialConversation || null);
    setAnswerDraft('');
    startedKeyRef.current = null;
  }, [initialConversation, contextId]);

  // Auto-start: as soon as the modal mounts for a gap with no existing
  // conversation, trigger the first AI question. Guarded against double-firing
  // under React StrictMode + remounts.
  useEffect(() => {
    if (!enhancementId || !contextId) return;
    if (conversation) return;
    const key = `${enhancementId}:${contextId}`;
    if (startedKeyRef.current === key) return;
    startedKeyRef.current = key;
    (async () => {
      try {
        const data = await startConversation({ enhancementId, contextId }).unwrap();
        setConversation(data);
      } catch (error) {
        startedKeyRef.current = null;
        toastMessage.error(getErrorMessage(error, 'Could not start the conversation.'));
      }
    })();
  }, [enhancementId, contextId, conversation, startConversation]);

  const pendingQuestion = conversation?.pendingQuestion ?? null;
  const status = conversation?.status ?? null;
  const messages = useMemo(
    () => Array.isArray(conversation?.messages) ? conversation.messages : [],
    [conversation],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      const inner = messagesScrollRef.current;
      if (inner) inner.scrollTop = inner.scrollHeight;

      // Scroll only the nearest scrollable ancestor (e.g. Ant Modal body),
      // never bubbling up to the page/editor.
      let node = bottomAnchorRef.current?.parentElement;
      while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const canScroll =
          (overflowY === 'auto' || overflowY === 'scroll') &&
          node.scrollHeight > node.clientHeight;
        if (canScroll) {
          node.scrollTop = node.scrollHeight;
          break;
        }
        node = node.parentElement;
      }
    });
  }, [messages.length, conversation?.pendingQuestion?.id, conversation?.status]);

  const handleSubmitAnswer = async (rawContent) => {
    const content = (rawContent ?? '').trim();
    if (!content || !conversation?.id) return;
    try {
      const data = await sendAnswer({
        enhancementId,
        conversationId: conversation.id,
        content,
        questionKind: pendingQuestion?.questionKind,
      }).unwrap();
      setConversation(data);
      setAnswerDraft('');
      if (data?.status === 'COMPLETED') {
        if (data.finalSuggestion) {
          dispatch(addSuggestionToContext({
            contextId,
            suggestion: data.finalSuggestion,
          }));
        }
        onCompleted?.(data);
      }
    } catch (error) {
      toastMessage.error(getErrorMessage(error, 'Failed to send the answer.'));
    }
  };

  const handleSkip = async () => {
    if (!conversation?.id) return;
    try {
      const data = await skipConversation({
        enhancementId,
        conversationId: conversation.id,
      }).unwrap();
      setConversation(data);
      onSkipped?.(data);
    } catch (error) {
      toastMessage.error(getErrorMessage(error, 'Failed to skip.'));
    }
  };

  if (!enhancementId || !contextId) {
    return null;
  }

  if (!conversation || isStarting) {
    return <ChatStartingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div ref={messagesScrollRef} className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
        {messages
          .filter((msg) => msg.messageType !== 'FINAL_SUGGESTION')
          .map((msg) => (
            <ChatBubble key={msg.id ?? `${msg.turnIndex}-${msg.role}`} msg={msg} />
          ))}
      </div>

      {status === 'IN_PROGRESS' && pendingQuestion ? (
        <PendingQuestionInput
          question={pendingQuestion}
          draft={answerDraft}
          setDraft={setAnswerDraft}
          onSubmit={handleSubmitAnswer}
          isSending={isSending}
        />
      ) : null}

      {status === 'IN_PROGRESS' ? (
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Honest answers help AI tailor the suggestion to your real experience.</span>
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSkipping}
            className="rounded px-2 py-1 font-medium text-neutral-500 transition-colors hover:bg-neutral-200 disabled:opacity-60"
          >
            Skip — let AI handle it
          </button>
        </div>
      ) : null}

      {status === 'COMPLETED' && conversation?.finalSuggestion?.suggestion ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Final suggestion
          </div>
          <div
            className="text-sm leading-relaxed text-neutral-800 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
            // Suggestion HTML is produced by the AI service (block-level tags only)
            // and travels through Core service validation; safe to render inline here.
            dangerouslySetInnerHTML={{ __html: conversation.finalSuggestion.suggestion }}
          />
          <div className="mt-2 text-xs italic text-emerald-700">
            Suggestion ready based on your answers.
          </div>
        </div>
      ) : null}
      <div ref={bottomAnchorRef} />
    </div>
  );
};

const ChatStartingSkeleton = () => (
  <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
    <div className="space-y-2">
      <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
    </div>
    <div className="text-xs italic text-neutral-500">
      AI is preparing the first question…
    </div>
  </div>
);

const ChatBubble = ({ msg }) => {
  const isAi = msg.role === 'AI';
  const base = 'rounded-lg px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap leading-snug';
  const ai = `${base} bg-white border border-neutral-200 text-neutral-800 self-start`;
  const user = `${base} bg-orange-500 text-white self-end`;
  if (msg.messageType === 'SKIP') {
    return (
      <div className="flex justify-end">
        <div className="rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs italic text-neutral-500">
          (skipped — let AI handle it)
        </div>
      </div>
    );
  }
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={isAi ? ai : user}>
        <div>{msg.content || ''}</div>
      </div>
    </div>
  );
};

const QUANTIFY_DEFAULT_OPTIONS = [
  'None',
  '< 1 year',
  '1-2 years',
  '2-3 years',
  '3-5 years',
  '5+ years',
];

const PendingQuestionInput = ({ question, draft, setDraft, onSubmit, isSending }) => {
  const kind = question.questionKind || 'DESCRIBE';
  const options = Array.isArray(question.options) ? question.options : [];

  if (kind === 'YES_NO' || kind === 'PROFICIENCY' || kind === 'QUANTIFY') {
    const fallback =
      kind === 'YES_NO' ? ['Yes', 'No']
      : kind === 'QUANTIFY' ? QUANTIFY_DEFAULT_OPTIONS
      : [];
    const effectiveOptions = options.length > 0 ? options : fallback;
    return (
      <div className="flex flex-col gap-2">
        <div className="text-[11px] uppercase tracking-wide text-neutral-500">
          {QUESTION_KIND_LABELS[kind]}
        </div>
        <div className="flex flex-wrap gap-2">
          {effectiveOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onSubmit(opt)}
              disabled={isSending}
              className="rounded-full border border-orange-300 px-3 py-1 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100 disabled:opacity-60"
            >
              {opt}
            </button>
          ))}
        </div>
        <FreeTextRow
          draft={draft}
          setDraft={setDraft}
          onSubmit={onSubmit}
          isSending={isSending}
          placeholder={
            kind === 'QUANTIFY'
              ? 'Or type a specific amount (e.g. 18 months, 4 projects)…'
              : 'Or type a more detailed answer…'
          }
        />
      </div>
    );
  }

  return (
    <FreeTextRow
      draft={draft}
      setDraft={setDraft}
      onSubmit={onSubmit}
      isSending={isSending}
      placeholder="Type a short answer…"
    />
  );
};

const FreeTextRow = ({ draft, setDraft, onSubmit, isSending, placeholder }) => (
  <div className="flex items-end gap-2">
    <textarea
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="flex-1 resize-none rounded border border-neutral-200 bg-white px-2 py-1.5 text-sm leading-snug focus:border-orange-300 focus:outline-none"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (draft.trim()) onSubmit(draft);
        }
      }}
    />
    <button
      type="button"
      onClick={() => onSubmit(draft)}
      disabled={isSending || !draft.trim()}
      className="rounded bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
    >
      {isSending ? 'Sending…' : 'Send'}
    </button>
  </div>
);

export default SuggestionChatPanel;
