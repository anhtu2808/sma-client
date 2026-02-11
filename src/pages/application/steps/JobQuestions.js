import React from 'react';
import { MessageSquare } from 'lucide-react';
import Input from '@/components/Input';
import StepWrapper from './StepWrapper';

const QuestionItem = ({ question, answer, onAnswerChange, error }) => {
    return (
        <div className={`p-5 rounded-xl border transition-colors ${error ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
            <label className="block text-sm font-semibold text-gray-900 mb-3 leading-relaxed">
                {question.question} {question.isRequired && <span className="text-red-500">*</span>}
            </label>
            <Input.TextArea
                value={answer || ''}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={3}
                className="!bg-white"
                error={!!error}
                helperText={error}
            />
        </div>
    );
};

const JobQuestions = ({ questions, answers, onAnswerChange, errors = {} }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <StepWrapper
            icon={<MessageSquare size={18} />}
            title="Application Questions"
            step="03"
        >
            <div className="space-y-4">
                {questions.map((q) => (
                    <QuestionItem
                        key={q.id}
                        question={q}
                        answer={answers[q.id]}
                        onAnswerChange={onAnswerChange}
                        error={errors[q.id]}
                    />
                ))}
            </div>
        </StepWrapper>
    );
};

export default JobQuestions;
