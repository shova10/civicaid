import { useEffect, useState } from "react";
import { X, Save, MessageSquare, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "../StatusBadge";
import PriorityBadge from "../PriorityBadge";
import { adminUpdateIssue } from "../../services/issues";

const STATUSES = [
  { value: "reported", label: "Reported" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "rejected", label: "Rejected" },
];

export default function IssueManagementPanel({ issue, onClose, onSaved }) {
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);

  // Populate form when issue changes
  useEffect(() => {
    if (!issue) return;

    setStatus(issue.status ?? "reported");
    setRemark("");
  }, [issue]);

  async function handleSave() {
    if ((status === "closed" || status === "rejected") && !remark.trim()) {
      toast.error("Please add a remark before closing/rejecting.");
      return;
    }

    setSaving(true);

    try {
      const updated = await adminUpdateIssue(issue.id, {
        status,
        remark: remark.trim() || null,
      });

      toast.success("Issue updated successfully.");

      onSaved?.(updated);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? "Failed to update issue.");
    } finally {
      setSaving(false);
    }
  }

  const open = !!issue;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Manage Issue
            </p>

            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              #{issue?.id} — {issue?.title?.slice(0, 40)}
              {(issue?.title?.length ?? 0) > 40 ? "…" : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700
              hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div
            className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl
            border border-slate-100"
          >
            <StatusBadge status={issue?.status} size="sm" />

            <PriorityBadge priority={issue?.priority} size="sm" />

            <span className="text-xs text-slate-400 ml-auto">
              {issue?.category}
            </span>
          </div>

          {/* Status */}
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-wider
              text-slate-500 mb-2"
            >
              Update Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm font-medium border border-slate-200 rounded-xl
                px-3 py-2.5 bg-white text-slate-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Remark */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider
              text-slate-500 mb-2 flex items-center gap-1.5"
            >
              <MessageSquare size={11} />
              Add Remark
            </label>

            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={4}
              placeholder="Add a note about this update…"
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5
                bg-white text-slate-700 placeholder:text-slate-300 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Warning */}
          {(status === "rejected" || status === "closed") && (
            <div
              className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl
              border border-amber-200"
            >
              <AlertTriangle
                size={14}
                className="text-amber-500 mt-0.5 shrink-0"
              />

              <p className="text-xs text-amber-700 font-medium">
                Setting status to <strong>{status}</strong> will close this
                issue. This action should be final.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 text-sm font-semibold text-slate-600 border border-slate-200
              py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2
              text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-300 py-2.5 rounded-xl transition-colors"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
