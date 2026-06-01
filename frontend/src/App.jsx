import { useState } from "react";
import api from "./services/api";

function App() {
  const [taskEmail, setTaskEmail] = useState("");
  const [previousEmails, setPreviousEmails] = useState("");
  const [progress, setProgress] = useState("");

  const [files, setFiles] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const analyzeTask = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResult(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              AI Task Execution Assistant
            </h1>

            <p className="text-slate-500 mt-2">
              TaskVirtual Internal Productivity Tool
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl shadow">
            <span className="text-sm text-slate-500">
              Version 1.0
            </span>
          </div>

        </div>

        {/* Input Section */}

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
              onChange={(e) =>
                setTaskEmail(e.target.value)
              }
              placeholder="Paste the client email here..."
            />

            <div className="mt-4">

              <label className="font-medium">
                Previous Email Thread
              </label>

              <textarea
                rows={6}
                className="w-full mt-2 border rounded-lg p-3"
                value={previousEmails}
                onChange={(e) =>
                  setPreviousEmails(e.target.value)
                }
                placeholder="Paste previous conversation..."
              />

            </div>

            <div className="mt-4">

              <label className="font-medium">
                Attachments
              </label>

              <div className="mt-3 border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50">

                <input
                  type="file"
                  multiple
                  onChange={handleFiles}
                  className="w-full"
                />

                <p className="text-sm text-slate-500 mt-2">
                  Upload PDF, DOCX, XLSX or TXT files
                </p>

              </div>

              {files.length > 0 && (
                <div className="mt-4 bg-slate-50 p-3 rounded-lg">

                  <h4 className="font-medium mb-2">
                    Selected Files
                  </h4>

                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="text-sm text-slate-600 py-1"
                    >
                      📄 {file.name}
                    </div>
                  ))}

                </div>
              )}

            </div>

            <button
              onClick={analyzeTask}
              disabled={loading}
              className="
                mt-5
                bg-black
                text-white
                px-5
                py-3
                rounded-lg
                transition-all
                duration-200
                hover:bg-slate-800
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Analyzing..."
                : "Analyze Task"}
            </button>

          </div>

          {/* Progress Section */}

          <div className="bg-white rounded-xl p-6 shadow">

            <h2 className="text-xl font-semibold mb-4">
              Progress Update
            </h2>

            <textarea
              rows={12}
              className="w-full border rounded-lg p-3"
              value={progress}
              onChange={(e) =>
                setProgress(e.target.value)
              }
              placeholder="Describe progress made on the task..."
            />

            <button
              className="
                mt-5
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-lg
                hover:bg-blue-700
                transition-all
                duration-200
              "
            >
              Analyze Progress
            </button>

          </div>

        </div>

        {/* Loading Banner */}

        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl mt-6 mb-6">
            Processing uploaded files...
          </div>
        )}

        {/* Analysis Cards */}

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

        {/* Upload Response */}

        {uploadResult && (
          <div className="bg-white rounded-xl p-6 shadow mt-8">

            <h2 className="text-xl font-semibold mb-4">
              Parsed Files Response
            </h2>

            <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(
                uploadResult,
                null,
                2
              )}
            </pre>

          </div>
        )}

        {/* Email Generator */}

        <div className="bg-white rounded-xl p-6 shadow mt-8">

          <h2 className="text-xl font-semibold mb-4">
            Email Generator
          </h2>

          <div className="flex flex-wrap gap-4 mb-4">

            <button
              className="
                bg-green-600
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-green-700
                transition-all
              "
            >
              Generate Client Update
            </button>

            <button
              className="
                bg-orange-500
                text-white
                px-4
                py-2
                rounded-lg
                hover:bg-orange-600
                transition-all
              "
            >
              Generate Clarification Email
            </button>

          </div>

          <textarea
            rows={10}
            className="w-full border rounded-lg p-3"
            placeholder="Generated email will appear here..."
          />

        </div>

      </div>
    </div>
  );
}

function ResultCard({ title, content }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 p-5 border border-slate-200">

      <h3 className="font-semibold text-lg mb-3">
        {title}
      </h3>

      <p className="text-slate-600 whitespace-pre-wrap">
        {content}
      </p>

    </div>
  );
}

export default App;