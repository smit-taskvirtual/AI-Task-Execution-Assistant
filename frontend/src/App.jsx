import { useState } from "react";

function App() {
  const [taskEmail, setTaskEmail] = useState("");
  const [previousEmails, setPreviousEmails] = useState("");
  const [progress, setProgress] = useState("");

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            AI Task Execution Assistant
          </h1>

          <p className="text-slate-500 mt-2">
            TaskVirtual Internal Productivity Tool
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">
              Task Input
            </h2>

            <label className="font-medium">
              Client Email
            </label>

            <textarea
              rows={8}
              className="w-full mt-2 border rounded-lg p-3"
              value={taskEmail}
              onChange={(e) => setTaskEmail(e.target.value)}
            />

            <div className="mt-4">
              <label className="font-medium">
                Previous Emails
              </label>

              <textarea
                rows={6}
                className="w-full mt-2 border rounded-lg p-3"
                value={previousEmails}
                onChange={(e) => setPreviousEmails(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="font-medium">
                Attachments
              </label>

              <input
                type="file"
                multiple
                className="block mt-2"
              />
            </div>

            <button className="mt-5 bg-black text-white px-5 py-2 rounded-lg">
              Analyze Task
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">
              Progress Update
            </h2>

            <textarea
              rows={12}
              className="w-full border rounded-lg p-3"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />

            <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg">
              Analyze Progress
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

          <ResultCard
            title="Executive Summary"
            content="Analysis will appear here"
          />

          <ResultCard
            title="Deliverables"
            content="Analysis will appear here"
          />

          <ResultCard
            title="Missing Information"
            content="Analysis will appear here"
          />

          <ResultCard
            title="Risks"
            content="Analysis will appear here"
          />

          <ResultCard
            title="Action Plan"
            content="Analysis will appear here"
          />

          <ResultCard
            title="Completion Status"
            content="Analysis will appear here"
          />

        </div>

        <div className="bg-white rounded-xl p-6 shadow mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Email Generator
          </h2>

          <div className="flex gap-4 mb-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Client Update
            </button>

            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
              Clarification Email
            </button>
          </div>

          <textarea
            rows={10}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>
    </div>
  );
}

function ResultCard({ title, content }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="font-semibold mb-3">
        {title}
      </h3>

      <p className="text-slate-600">
        {content}
      </p>
    </div>
  );
}

export default App;