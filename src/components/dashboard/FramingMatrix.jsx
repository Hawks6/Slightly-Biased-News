"use client";

import { useState } from "react";
import { BIAS_COLORS } from "../Constants";

// ─── Constants ────────────────────────────────────────────────────────────────

const FRAMING_LENSES = [
  "Conflict",
  "Economic",
  "Human Interest",
  "Moral",
  "Responsibility",
  "Policy",
  "Leadership",
];

// Abbreviated column headers for compact layout
const LENS_ABBREV = {
  "Conflict":       "Conflict",
  "Economic":       "Economic",
  "Human Interest": "Human Int.",
  "Moral":          "Moral",
  "Responsibility": "Resp.",
  "Policy":         "Policy",
  "Leadership":     "Leadership",
};

// Framing lens colors (ink-print palette — stays readable on off-white)
const LENS_COLORS = {
  "Conflict":       "#990000",
  "Economic":       "#1B5E20",
  "Human Interest": "#01579B",
  "Moral":          "#4A148C",
  "Responsibility": "#E65100",
  "Policy":         "#004D40",
  "Leadership":     "#1A237E",
};

// 5 organic blob SVG paths in a 40×40 viewBox — selected deterministically
const BLOB_PATHS = [
  "M20 6 C26 4, 34 8, 34 16 C34 26, 28 36, 20 35 C12 34, 6 26, 6 18 C6 10, 14 8, 20 6Z",
  "M20 5 C27 3, 36 10, 35 18 C34 27, 26 37, 18 36 C10 35, 4 27, 5 18 C6 9, 13 7, 20 5Z",
  "M21 5 C29 4, 36 11, 35 20 C34 29, 27 37, 19 36 C11 35, 4 28, 5 19 C6 10, 13 6, 21 5Z",
  "M20 6 C25 3, 35 7, 35 17 C35 27, 28 37, 20 36 C12 35, 5 28, 5 18 C5 8, 15 9, 20 6Z",
  "M22 5 C30 3, 37 10, 36 19 C35 28, 26 38, 18 37 C10 36, 3 28, 4 18 C5 8, 14 7, 22 5Z",
];

// ─── Data Pivot ───────────────────────────────────────────────────────────────

/**
 * Collapses sourceCards (flat article array) into per-source framing scores.
 * Each unique source gets one row. The framing label is the highest-confidence
 * article from that source.
 *
 * Returns: Array<{ sourceName, initials, bias, primaryLabel, confidence }>
 */
function buildMatrixRows(sourceCards) {
  if (!sourceCards || sourceCards.length === 0) return [];

  const sourceMap = new Map();

  sourceCards.forEach((card) => {
    const name = card.source || card.sourceId || "Unknown";
    if (!sourceMap.has(name)) {
      sourceMap.set(name, {
        sourceName: name,
        initials: name
          .split(/[\s\.\-]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase() || "")
          .join(""),
        bias: card.bias || "center",
        bestConfidence: 0,
        primaryLabel: null,
      });
    }

    const row = sourceMap.get(name);
    const conf = card.framing?.confidence ?? 0;
    if (card.framing?.label && card.framing.label !== "Neutral" && conf > row.bestConfidence) {
      row.bestConfidence = conf;
      row.primaryLabel = card.framing.label;
    }
  });

  return Array.from(sourceMap.values()).filter((r) => r.primaryLabel);
}

// ─── Ink Blot Cell ────────────────────────────────────────────────────────────

function InkBlot({ label, confidence, sourceIndex, colIndex, biasColor, sourceName }) {
  const [hovered, setHovered] = useState(false);

  if (!label) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span style={{ color: "#DCDCDC", fontSize: "18px", lineHeight: 1 }}>·</span>
      </div>
    );
  }

  const blobPath = BLOB_PATHS[(sourceIndex + colIndex) % BLOB_PATHS.length];
  // Scale: confidence 0.4 → scale 0.55, confidence 1.0 → scale 1.3
  const scale = 0.45 + confidence * 0.85;
  const lensColor = LENS_COLORS[label] || biasColor || "#333";
  const pct = Math.round(confidence * 100);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 40 40"
        width="36"
        height="36"
        style={{ overflow: "visible", transition: "transform 0.2s ease" }}
      >
        <g transform={`translate(20,20) scale(${scale}) translate(-20,-20)`}>
          <path
            d={blobPath}
            fill={lensColor}
            opacity={hovered ? 0.9 : 0.72}
            style={{ transition: "opacity 0.15s ease, transform 0.2s ease" }}
          />
        </g>
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#121212",
            color: "#F7F5F0",
            padding: "5px 9px",
            borderRadius: "3px",
            fontSize: "10px",
            fontFamily: "var(--font-ui)",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontWeight: 600 }}>{sourceName}</span> — {label}{" "}
          <span style={{ opacity: 0.6 }}>({pct}% conf.)</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FramingMatrix({ sourceCards }) {
  const rows = buildMatrixRows(sourceCards);

  if (rows.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--color-bg-page)",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: "4px",
        marginBottom: "0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "2px solid rgba(0,0,0,0.18)",
          padding: "14px 20px 12px",
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#121212",
          }}
        >
          Framing Matrix
        </span>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "10px",
            color: "#6B6B6B",
            letterSpacing: "0.02em",
          }}
        >
          Narrative lens · per source · blot size = confidence
        </span>
      </div>

      {/* Scrollable table wrapper for narrow viewports */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "560px",
          }}
        >
          {/* Column headers */}
          <thead>
            <tr>
              {/* Empty top-left corner */}
              <th
                style={{
                  width: "130px",
                  minWidth: "110px",
                  borderBottom: "1px solid rgba(0,0,0,0.12)",
                  borderRight: "1px solid rgba(0,0,0,0.08)",
                  padding: "8px 14px",
                  textAlign: "left",
                  background: "rgba(0,0,0,0.025)",
                }}
              />
              {FRAMING_LENSES.map((lens) => (
                <th
                  key={lens}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.12)",
                    borderRight: "1px solid rgba(0,0,0,0.06)",
                    padding: "8px 4px 8px",
                    textAlign: "center",
                    background: "rgba(0,0,0,0.025)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: LENS_COLORS[lens],
                      display: "block",
                    }}
                  >
                    {LENS_ABBREV[lens]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Source rows */}
          <tbody>
            {rows.map((row, si) => {
              const biasColor = BIAS_COLORS[
                row.bias
                  .split("-")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ")
              ] || "#6B6B6B";

              return (
                <tr
                  key={row.sourceName}
                  style={{
                    borderBottom:
                      si < rows.length - 1 ? "1px solid rgba(0,0,0,0.07)" : "none",
                  }}
                >
                  {/* Source label cell */}
                  <td
                    style={{
                      padding: "6px 14px",
                      borderRight: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(0,0,0,0.018)",
                      verticalAlign: "middle",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* Bias-colored initials badge */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "22px",
                          height: "22px",
                          borderRadius: "3px",
                          background: biasColor + "20",
                          border: `1px solid ${biasColor}33`,
                          color: biasColor,
                          fontFamily: "var(--font-ui)",
                          fontSize: "9px",
                          fontWeight: 700,
                          flexShrink: 0,
                          letterSpacing: "0",
                        }}
                      >
                        {row.initials || "?"}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#3D3D3D",
                          maxWidth: "90px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={row.sourceName}
                      >
                        {row.sourceName}
                      </span>
                    </div>
                  </td>

                  {/* Lens cells */}
                  {FRAMING_LENSES.map((lens, ci) => {
                    const isMatch = row.primaryLabel === lens;
                    return (
                      <td
                        key={lens}
                        style={{
                          width: "56px",
                          height: "52px",
                          padding: "2px",
                          textAlign: "center",
                          verticalAlign: "middle",
                          borderRight: "1px solid rgba(0,0,0,0.05)",
                          background: isMatch
                            ? `${LENS_COLORS[lens]}08`
                            : "transparent",
                          transition: "background 0.15s",
                        }}
                      >
                        <InkBlot
                          label={isMatch ? lens : null}
                          confidence={isMatch ? row.bestConfidence : 0}
                          sourceIndex={si}
                          colIndex={ci}
                          biasColor={biasColor}
                          sourceName={row.sourceName}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend footer */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.1)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg viewBox="0 0 40 40" width="14" height="14">
            <g transform="translate(20,20) scale(0.5) translate(-20,-20)">
              <path d={BLOB_PATHS[0]} fill="#333" opacity="0.6" />
            </g>
          </svg>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              color: "#6B6B6B",
              letterSpacing: "0.04em",
            }}
          >
            Low confidence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg viewBox="0 0 40 40" width="18" height="18">
            <g transform="translate(20,20) scale(1.0) translate(-20,-20)">
              <path d={BLOB_PATHS[0]} fill="#333" opacity="0.6" />
            </g>
          </svg>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              color: "#6B6B6B",
              letterSpacing: "0.04em",
            }}
          >
            High confidence
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "9px",
            color: "#ADADAD",
            marginLeft: "auto",
            letterSpacing: "0.04em",
          }}
        >
          Hover blot for details · colour = framing lens
        </span>
      </div>
    </div>
  );
}
