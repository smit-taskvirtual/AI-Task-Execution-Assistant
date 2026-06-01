import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [taskEmail, setTaskEmail] = useState("");
  const [previousEmails, setPreviousEmails] = useState("");
  const [files, setFiles] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/analyze-task",
        {
          taskEmail,
          previousEmails,
          attachments: files
            .map((f) => f.name)
            .join(", "),
        }
      );

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(
        analysis?.clientReply || ""
      );

      alert("Email copied to clipboard");
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight">
            AI Task Execution Assistant
          </h1>

          <p className="text-slate-600 mt-2">
            TaskVirtual Internal Productivity Tool
          </p>
        </div>

        {/* INPUT SECTION */}

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-bold mb-5">
              Task Information
            </h2>

            <label className="font-medium">
              Client Email
            </label>

            <textarea
              rows={8}
              value={taskEmail}
              onChange={(e) =>
                setTaskEmail(e.target.value)
              }
              className="w-full border rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste client email here..."
            />

            <div className="mt-5">
              <label className="font-medium">
                Previous Emails
              </label>

              <textarea
                rows={6}
                value={previousEmails}
                onChange={(e) =>
                  setPreviousEmails(e.target.value)
                }
                className="w-full border rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste previous conversation..."
              />
            </div>

            <div className="mt-5">

              <label className="font-medium">
                Attachments
              </label>

              <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50">

                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full"
                />

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">

                    {files.map((file) => (
                      <div
                        key={file.name}
                        className="bg-white border rounded-lg px-3 py-2 text-sm"
                      >
                        📄 {file.name}
                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading
                ? "Analyzing Task..."
                : "Analyze Task"}
            </button>

          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h2 className="text-xl font-bold mb-5">
              Project Snapshot
            </h2>

            <InfoCard
              label="Estimated Effort"
              value={analysis?.estimatedEffort || "--"}
            />

            <InfoCard
              label="Deliverables"
              value={analysis?.deliverables?.length || 0}
            />

            <InfoCard
              label="Risks"
              value={analysis?.risks?.length || 0}
            />

            <InfoCard
              label="Missing Information"
              value={
                analysis?.missingInformation?.length || 0
              }
            />

          </div>

        </div>

        {/* EXECUTIVE SUMMARY */}

        <div className="mt-8">
          <ResultCard
            title="Executive Summary"
            content={analysis?.executiveSummary}
            color="blue"
          />
        </div>

        {/* ANALYSIS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          <ResultCard
            title="Deliverables"
            content={analysis?.deliverables}
            color="green"
          />

          <ResultCard
            title="Missing Information"
            content={analysis?.missingInformation}
            color="amber"
          />

          <ResultCard
            title="Risks"
            content={analysis?.risks}
            color="red"
          />

          <ResultCard
            title="Action Plan"
            content={analysis?.actionPlan}
            color="indigo"
          />

        </div>

        {/* EMAIL */}

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-bold">
              Client Email Draft
            </h2>

            <button
              onClick={copyEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Copy Email
            </button>

          </div>

          <div className="border rounded-xl p-5 bg-slate-50 max-h-[600px] overflow-auto">

            <MarkdownContent
              content={analysis?.clientReply}
            />

          </div>

        </div>

      </div>
    </div>
  );
}

function ResultCard({
  title,
  content,
  color = "blue",
}) {

  const colors = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
    amber: "border-amber-500 bg-amber-50",
    red: "border-red-500 bg-red-50",
    indigo: "border-indigo-500 bg-indigo-50",
  };

  return (
    <div
      className={`
        rounded-2xl
        border-l-4
        p-6
        shadow-sm
        min-h-[250px]
        ${colors[color]}
      `}
    >
      <h3 className="font-bold text-lg mb-4">
        {title}
      </h3>

      {!content ? (
        <p className="text-slate-500">
          Analysis will appear here
        </p>
      ) : Array.isArray(content) ? (
        <div className="space-y-3">

          {content.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-3"
            >
              <MarkdownContent
                content={item}
              />
            </div>
          ))}

        </div>
      ) : (
        <MarkdownContent
          content={content}
        />
      )}

    </div>
  );
}

function InfoCard({
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 border rounded-xl p-4 mb-3">

      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="text-2xl font-bold mt-1">
        {value}
      </div>

    </div>
  );
}

function MarkdownContent({
  content,
}) {
  return (
    <div className="prose prose-slate max-w-none">

      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-3 leading-7 text-slate-700">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">
              {children}
            </strong>
          ),

          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2">
              {children}
            </h3>
          ),
        }}
      >
        {content || ""}
      </ReactMarkdown>

    </div>
  );
}

export default App;