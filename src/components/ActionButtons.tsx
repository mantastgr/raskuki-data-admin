type ActionButtonsProps = {
  loading: boolean;
  text: string;
  hasDraft: boolean;
  enhancing: boolean;
  hasEnhancement: boolean;
  hasAppliedDraft: boolean;
  onGenerate: () => void;
  onEnhance: () => void;
  onApplyAiToJson: () => void;
  onResetToOriginal: () => void;
  onBuildFarmTemplateJson: () => void;
};

export function ActionButtons({
  loading,
  text,
  hasDraft,
  enhancing,
  hasEnhancement,
  hasAppliedDraft,
  onGenerate,
  onEnhance,
  onApplyAiToJson,
  onResetToOriginal,
  onBuildFarmTemplateJson,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onGenerate}
        disabled={loading || !text.trim()}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Draft"}
      </button>

      <button
        onClick={onEnhance}
        disabled={!hasDraft || enhancing}
        className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {enhancing ? "Enhancing..." : "Enhance Preview (AI)"}
      </button>

      <button
        onClick={onApplyAiToJson}
        disabled={!hasDraft || !hasEnhancement}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Apply AI To JSON
      </button>

      <button
        onClick={onResetToOriginal}
        disabled={!hasDraft || !hasAppliedDraft}
        className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Reset To Original
      </button>

      <button
        onClick={onBuildFarmTemplateJson}
        disabled={!hasDraft}
        className="rounded bg-orange-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Build Farm Template JSON
      </button>
    </div>
  );
}
