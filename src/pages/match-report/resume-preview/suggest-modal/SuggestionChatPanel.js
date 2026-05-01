import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
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

const QUANTIFY_DEFAULT_OPTIONS = [
  'None',
  '< 1 year',
  '1-2 years',
  '2-3 years',
  '3-5 years',
  '5+ years',
];

const SuggestionChatPanel = ({
  contextId,
  enhancementId: enhancementIdProp,
  initialConversation = null,
  onCompleted,
  onSkipped,
  onActionsChange,
}) => {
  const params = useParams();
  const dispatch = useDispatch();
  const enhancementId = enhancementIdProp ?? Number(params.enhancementId);

  const [startConversation, { isLoading: isStarting }] = useStartSuggestionConversationMutation();
  const [sendAnswer, { isLoading: isSending }] = useSendSuggestionConversationAnswerMutation();
  const [skipConversation, { isLoading: isSkipping }] = useSkipSuggestionConversationMutation();

  const [conversation, setConversation] = useState(initialConversation);
  const [batchAnswers, setBatchAnswers] = useState({});
  const startedKeyRef = useRef(null);
  const bottomAnchorRef = useRef(null);
  const completedNotifiedRef = useRef(null);

  useEffect(() => {
    setConversation(initialConversation || null);
    setBatchAnswers({});
    startedKeyRef.current = null;
    completedNotifiedRef.current = null;
  }, [initialConversation, contextId]);

  useEffect(() => {
    if (conversation?.status !== 'COMPLETED' || !conversation?.id) return;
    if (completedNotifiedRef.current === conversation.id) return;
    completedNotifiedRef.current = conversation.id;
    if (conversation.finalSuggestion && contextId) {
      dispatch(addSuggestionToContext({
        contextId,
        suggestion: conversation.finalSuggestion,
      }));
    }
    onCompleted?.(conversation);
  }, [conversation, contextId, dispatch, onCompleted]);

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

  const pendingQuestions = useMemo(() => {
    const list = Array.isArray(conversation?.pendingQuestions) ? conversation.pendingQuestions : null;
    if (list && list.length > 0) return list;
    return conversation?.pendingQuestion ? [conversation.pendingQuestion] : [];
  }, [conversation]);

  // Reset batch when the pending batch changes (new turn arrived).
  const pendingKey = pendingQuestions.map((q) => q.id).join(',');
  useEffect(() => {
    setBatchAnswers({});
  }, [pendingKey]);

  const status = conversation?.status ?? null;
  const pendingIds = useMemo(() => new Set(pendingQuestions.map((q) => q.id)), [pendingQuestions]);

  // Pair each past AI question with its matching USER answer (same target label,
  // user turn = ai turn + 1). Pending questions are excluded — they render
  // separately as input cards below.
  const answeredPairs = useMemo(() => {
    const all = Array.isArray(conversation?.messages) ? conversation.messages : [];
    const aiByTurn = new Map();
    const userByTurn = new Map();
    for (const m of all) {
      if (pendingIds.has(m.id)) continue;
      const t = Number(m.turnIndex ?? 0);
      if (m.role === 'AI' && m.messageType === 'QUESTION') {
        if (!aiByTurn.has(t)) aiByTurn.set(t, []);
        aiByTurn.get(t).push(m);
      } else if (m.role === 'USER' && (m.messageType === 'ANSWER' || m.messageType === 'SKIP')) {
        if (!userByTurn.has(t)) userByTurn.set(t, []);
        userByTurn.get(t).push(m);
      }
    }
    const pairs = [];
    const aiTurns = Array.from(aiByTurn.keys()).sort((a, b) => a - b);
    for (const aiTurn of aiTurns) {
      const aiMsgs = aiByTurn.get(aiTurn);
      const userMsgs = [...(userByTurn.get(aiTurn + 1) || [])];
      for (const ai of aiMsgs) {
        let userIdx = -1;
        if (ai.targetLabel) {
          userIdx = userMsgs.findIndex((u) => u.targetLabel && u.targetLabel === ai.targetLabel);
        }
        if (userIdx < 0) userIdx = 0;
        const user = userIdx >= 0 ? userMsgs.splice(userIdx, 1)[0] : null;
        pairs.push({ ai, user });
      }
    }
    return pairs;
  }, [conversation, pendingIds]);

  useEffect(() => {
    requestAnimationFrame(() => {
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
  }, [answeredPairs.length, pendingKey, status]);

  useEffect(() => {
    if (!onActionsChange) return;
    if (status === 'IN_PROGRESS' && pendingQuestions.length > 0) {
      onActionsChange({
        submit: () => handleSubmitBatch(),
        skipAll: () => handleSkipAll(),
        canSubmit: pendingQuestions.every((q) => {
          const a = batchAnswers[q.id];
          return a && (a.skip || (a.content && a.content.trim()));
        }),
        isSending,
        isSkipping,
      });
    } else {
      onActionsChange(null);
    }
    return () => onActionsChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pendingKey, batchAnswers, isSending, isSkipping]);

  const allAnsweredOrSkipped = pendingQuestions.length > 0 && pendingQuestions.every((q) => {
    const a = batchAnswers[q.id];
    return a && (a.skip || (a.content && a.content.trim()));
  });

  const handleSubmitBatch = async () => {
    if (!conversation?.id || !allAnsweredOrSkipped) return;
    const answers = pendingQuestions.map((q) => ({
      content: batchAnswers[q.id]?.skip ? null : (batchAnswers[q.id]?.content || '').trim(),
      questionKind: q.questionKind,
      targetLabel: q.targetLabel,
      skip: !!batchAnswers[q.id]?.skip,
    }));
    try {
      const data = await sendAnswer({
        enhancementId,
        conversationId: conversation.id,
        answers,
      }).unwrap();
      setConversation(data);
      setBatchAnswers({});
    } catch (error) {
      toastMessage.error(getErrorMessage(error, 'Failed to send answers.'));
    }
  };

  const handleSkipAll = async () => {
    if (!conversation?.id) return;
    try {
      const data = await skipConversation({
        enhancementId,
        conversationId: conversation.id,
      }).unwrap();
      setConversation(data);
      if (data?.status !== 'COMPLETED') onSkipped?.(data);
    } catch (error) {
      toastMessage.error(getErrorMessage(error, 'Failed to skip.'));
    }
  };

  if (!enhancementId || !contextId) return null;
  if (!conversation || isStarting) return <ChatStartingSkeleton />;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      {answeredPairs.length > 0 && (
        <div className="flex flex-col gap-2">
          {answeredPairs.map(({ ai, user }) => (
            <AnsweredQuestionCard key={ai.id} question={ai} answer={user} />
          ))}
        </div>
      )}

      {status === 'IN_PROGRESS' && pendingQuestions.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-neutral-600">
            {pendingQuestions.length === 1
              ? 'A quick question so AI can tailor the suggestion to you:'
              : 'Quick answers below — they help AI write a suggestion that fits your real experience:'}
          </div>
          {pendingQuestions.map((q, idx) => (
            <BatchQuestionCard
              key={q.id ?? idx}
              index={idx}
              question={q}
              answer={batchAnswers[q.id] || {}}
              onChange={(val) => setBatchAnswers((prev) => ({ ...prev, [q.id]: { content: val, skip: false } }))}
              onSkip={() => setBatchAnswers((prev) => ({ ...prev, [q.id]: { content: '', skip: true } }))}
              disabled={isSending}
            />
          ))}
        </div>
      ) : null}

      {status === 'COMPLETED' && conversation?.finalSuggestion?.suggestion ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Final suggestion
          </div>
          <div
            className="text-sm leading-relaxed text-neutral-800 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
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
      AI is preparing the first questions…
    </div>
  </div>
);

const AnsweredQuestionCard = ({ question, answer }) => {
  const skipped = answer?.messageType === 'SKIP' || !answer?.content;
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-emerald-200 bg-white p-3">
      {question.targetLabel && (
        <div className="inline-block w-fit rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          {question.targetLabel}
        </div>
      )}
      <div className="text-sm leading-snug text-neutral-700">{question.content}</div>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] uppercase tracking-wide text-neutral-400">Your answer:</span>
        {skipped ? (
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs italic text-neutral-500">
            Skipped — let AI handle it
          </span>
        ) : (
          <span className="rounded bg-orange-50 px-2 py-0.5 text-sm font-medium text-orange-700">
            {answer.content}
          </span>
        )}
      </div>
    </div>
  );
};

const BatchQuestionCard = ({ question, answer, onChange, onSkip, disabled }) => {
  const kind = question.questionKind || 'DESCRIBE';
  const options = Array.isArray(question.options) ? question.options : [];
  const fallback =
    kind === 'YES_NO' ? ['Yes', 'No']
    : kind === 'QUANTIFY' ? QUANTIFY_DEFAULT_OPTIONS
    : kind === 'PROFICIENCY' ? ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    : [];
  const effectiveOptions = options.length > 0 ? options : fallback;
  const isConstrained = kind === 'YES_NO' || kind === 'QUANTIFY' || kind === 'PROFICIENCY';
  const skipped = !!answer.skip;

  return (
    <div className={`flex flex-col gap-2 rounded-lg border p-3 ${skipped ? 'border-neutral-200 bg-neutral-100/60' : 'border-amber-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {question.targetLabel && (
            <div className="mb-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              {question.targetLabel}
            </div>
          )}
          <div className="text-sm leading-snug text-neutral-800">{question.content}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
            {QUESTION_KIND_LABELS[kind] || kind}
          </div>
        </div>
        <button
          type="button"
          onClick={onSkip}
          disabled={disabled}
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-60 ${
            skipped
              ? 'bg-neutral-200 text-neutral-600'
              : 'text-neutral-500 hover:bg-neutral-100'
          }`}
        >
          {skipped ? 'Skipped' : 'Skip'}
        </button>
      </div>
      {!skipped && (
        <>
          {isConstrained && effectiveOptions.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5">
                {effectiveOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    disabled={disabled}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-60 ${
                      answer.content === opt
                        ? 'border-orange-500 bg-orange-100 text-orange-700'
                        : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={answer.content || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Or type your own answer…"
                disabled={disabled}
                className="w-full rounded border border-neutral-200 bg-white px-2 py-1.5 text-sm leading-snug focus:border-orange-300 focus:outline-none disabled:opacity-60"
              />
            </div>
          ) : (
            <textarea
              value={answer.content || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type a short answer…"
              rows={2}
              disabled={disabled}
              className="w-full resize-none rounded border border-neutral-200 bg-white px-2 py-1.5 text-sm leading-snug focus:border-orange-300 focus:outline-none disabled:opacity-60"
            />
          )}
        </>
      )}
    </div>
  );
};

export default SuggestionChatPanel;
