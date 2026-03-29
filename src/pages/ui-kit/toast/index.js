import React, { useState, useRef } from 'react';
import { ToastContainer, toast, Bounce, Slide, Zoom, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const positions = ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'];
const themes = ['light', 'dark', 'colored'];
const transitions = { Bounce, Slide, Zoom, Flip };

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h2>
    <div className="flex flex-wrap gap-3">{children}</div>
  </div>
);

const Btn = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-colors ${className}`}
  >
    {children}
  </button>
);

export default function ToastTest() {
  const [position, setPosition] = useState('top-right');
  const [theme, setTheme] = useState('light');
  const [transition, setTransition] = useState('Bounce');
  const [autoClose, setAutoClose] = useState(3000);
  const toastIdRef = useRef(null);

  const opts = {
    position,
    theme,
    transition: transitions[transition],
    autoClose,
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Toast UI Kit - react-toastify</h1>
      <p className="text-gray-500 mb-8">Preview all react-toastify variants before migrating.</p>

      {/* Global config */}
      <Section title="Global Configuration">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Position</span>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border"
            >
              {positions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border"
            >
              {themes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Transition</span>
            <select
              value={transition}
              onChange={(e) => setTransition(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border"
            >
              {Object.keys(transitions).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Auto-close (ms)</span>
            <input
              type="number"
              value={autoClose}
              onChange={(e) => setAutoClose(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm p-2 border"
              min={1000}
              step={500}
            />
          </label>
        </div>
      </Section>

      {/* Basic types */}
      <Section title="Basic Types">
        <Btn onClick={() => toast('Default toast notification', opts)}>Default</Btn>
        <Btn onClick={() => toast.success('Operation completed successfully!', opts)}>Success</Btn>
        <Btn onClick={() => toast.error('Something went wrong!', opts)}>Error</Btn>
        <Btn onClick={() => toast.warning('Please check your input.', opts)}>Warning</Btn>
        <Btn onClick={() => toast.info('Here is some information.', opts)}>Info</Btn>
      </Section>

      {/* Options */}
      <Section title="Options">
        <Btn onClick={() => toast.success('No progress bar', { ...opts, hideProgressBar: true })}>
          Hide Progress Bar
        </Btn>
        <Btn onClick={() => toast.info('Not draggable', { ...opts, draggable: false })}>
          Not Draggable
        </Btn>
        <Btn onClick={() => toast.info('No pause on hover', { ...opts, pauseOnHover: false })}>
          No Pause on Hover
        </Btn>
        <Btn onClick={() => toast.info('Close on click disabled', { ...opts, closeOnClick: false })}>
          No Close on Click
        </Btn>
        <Btn onClick={() => toast.info('No close button', { ...opts, closeButton: false })}>
          No Close Button
        </Btn>
        <Btn onClick={() => toast.success('10 seconds auto-close', { ...opts, autoClose: 10000 })}>
          Long Duration (10s)
        </Btn>
        <Btn onClick={() => toast.warning('Will not auto-close', { ...opts, autoClose: false })}>
          No Auto-Close
        </Btn>
      </Section>

      {/* Custom content */}
      <Section title="Custom Content">
        <Btn onClick={() => toast(
          <div>
            <strong>Custom JSX</strong>
            <p className="text-sm text-gray-500 mt-1">Rich content inside a toast with HTML elements.</p>
          </div>,
          opts
        )}>
          JSX Content
        </Btn>
        <Btn onClick={() => toast.info(
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
            <div>
              <p className="font-medium">New message</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
          </div>,
          { ...opts, icon: false }
        )}>
          Custom with Avatar
        </Btn>
        <Btn onClick={() => toast.success('Custom close button', {
          ...opts,
          closeButton: ({ closeToast }) => (
            <button onClick={closeToast} className="text-red-500 font-bold text-lg leading-none">&times;</button>
          ),
        })}>
          Custom Close Button
        </Btn>
      </Section>

      {/* Promise toast */}
      <Section title="Promise Toast">
        <Btn onClick={() => {
          const myPromise = new Promise((resolve) => setTimeout(resolve, 2000));
          toast.promise(myPromise, {
            pending: 'Loading data...',
            success: 'Data loaded successfully!',
            error: 'Failed to load data.',
          }, opts);
        }}>
          Resolve (2s)
        </Btn>
        <Btn onClick={() => {
          const myPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('fail')), 2000));
          toast.promise(myPromise, {
            pending: 'Submitting form...',
            success: 'Submitted!',
            error: 'Submission failed!',
          }, opts);
        }}>
          Reject (2s)
        </Btn>
      </Section>

      {/* Update toast */}
      <Section title="Update Toast">
        <Btn onClick={() => {
          toastIdRef.current = toast.loading('Processing...', { ...opts, autoClose: false });
        }}>
          Show Loading Toast
        </Btn>
        <Btn onClick={() => {
          if (toastIdRef.current) {
            toast.update(toastIdRef.current, {
              render: 'Done!',
              type: 'success',
              isLoading: false,
              ...opts,
            });
          }
        }}>
          Update to Success
        </Btn>
        <Btn onClick={() => {
          if (toastIdRef.current) {
            toast.update(toastIdRef.current, {
              render: 'Something failed!',
              type: 'error',
              isLoading: false,
              ...opts,
            });
          }
        }}>
          Update to Error
        </Btn>
      </Section>

      {/* Dismiss */}
      <Section title="Dismiss">
        <Btn onClick={() => {
          const id = toast.info('Dismiss me by ID', { ...opts, autoClose: false });
          setTimeout(() => toast.dismiss(id), 2000);
        }}>
          Auto-dismiss after 2s
        </Btn>
        <Btn onClick={() => toast.dismiss()}>Dismiss All</Btn>
      </Section>

      <ToastContainer
        position={position}
        autoClose={autoClose}
        theme={theme}
        transition={transitions[transition]}
        newestOnTop
        draggable
        pauseOnHover
        closeOnClick
      />
    </div>
  );
}
