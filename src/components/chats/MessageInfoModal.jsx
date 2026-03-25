import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCheck, Clock3, FileText, ImageIcon, X } from "lucide-react";
import api from "../../api/axios";
import GradientAvatar from "../common/GradientAvatar";

const formatDateTime = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const MessageInfoModal = ({ open, message, anchorRef = null, onClose }) => {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [position, setPosition] = useState({ top: 96, left: 16 });
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!open || !message?.Message_ID) return;

    let isMounted = true;

    const fetchMessageInfo = async () => {
      setStatus("loading");
      setError("");

      try {
        const res = await api.get(`/chats/message-info/${message.Message_ID}`);
        if (!isMounted) return;
        setInfo(res.data?.data || null);
        setStatus("succeeded");
      } catch (err) {
        if (!isMounted) return;
        setError(
          err.response?.data?.message || "Failed to load message details.",
        );
        setStatus("failed");
      }
    };

    fetchMessageInfo();

    return () => {
      isMounted = false;
    };
  }, [message?.Message_ID, open]);

  const seenReceipts = useMemo(
    () => (info?.receipts || []).filter((receipt) => Boolean(receipt.Seen_On)),
    [info?.receipts],
  );

  const pendingReceipts = useMemo(
    () => (info?.receipts || []).filter((receipt) => !receipt.Seen_On),
    [info?.receipts],
  );

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchorEl = anchorRef?.current;
      const popoverEl = popoverRef.current;

      if (!anchorEl || !popoverEl) {
        setPosition({
          top: 96,
          left: Math.max((window.innerWidth - 360) / 2, 16),
        });
        return;
      }

      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverEl.getBoundingClientRect();
      const gap = 10;
      const viewportPadding = 16;

      const preferredTop = anchorRect.bottom + gap;
      const fallbackTop = anchorRect.top - popoverRect.height - gap;
      const canOpenBelow =
        preferredTop + popoverRect.height <=
        window.innerHeight - viewportPadding;

      const top = canOpenBelow
        ? preferredTop
        : Math.max(fallbackTop, viewportPadding);
      const left = clamp(
        anchorRect.right - popoverRect.width,
        viewportPadding,
        window.innerWidth - popoverRect.width - viewportPadding,
      );

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, info, open, status]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (popoverRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [anchorRef, onClose, open]);

  if (!open) return null;

  const content =
    message?.Message_Type === "image"
      ? "Image attachment"
      : message?.Message_Type === "file"
        ? message?.Message_Text || "File attachment"
        : message?.Message_Text || "Message";

  const previewText =
    content.length > 90 ? `${content.slice(0, 87).trimEnd()}...` : content;

  return createPortal(
    <div
      className="fixed z-50 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div
        ref={popoverRef}
        className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-primary/10 px-3 py-2.5">
          <h3 className="font-poppins text-sm font-semibold text-primary">
            Message info
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary/60 transition hover:bg-primary/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto bg-[#FFFBEB] p-3">
          <div className="rounded-xl border border-primary/10 bg-white p-2.5">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0 text-primary/60">
                {message?.Message_Type === "image" ? (
                  <ImageIcon className="w-4 h-4" />
                ) : message?.Message_Type === "file" ? (
                  <FileText className="w-4 h-4" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="break-words text-xs leading-5 text-primary">
                  {previewText}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-primary/50">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{formatDateTime(message?.Sent_On)}</span>
                </div>
              </div>
            </div>
          </div>

          {status === "loading" && (
            <div className="rounded-xl border border-primary/10 bg-white p-2.5 text-xs text-primary/60">
              Loading message details...
            </div>
          )}

          {status === "failed" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
              {error}
            </div>
          )}

          {status === "succeeded" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-primary/10 bg-white px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-primary/45">
                    Seen
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {seenReceipts.length}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-white px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-primary/45">
                    Delivered
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {pendingReceipts.length}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-primary/10 bg-white p-2.5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="text-xs font-semibold text-primary">Seen by</h4>
                  <span className="text-[10px] text-primary/45">
                    {seenReceipts.length}
                  </span>
                </div>

                {seenReceipts.length === 0 ? (
                  <p className="text-xs text-primary/50">No one has seen this yet.</p>
                ) : (
                  <div className="space-y-2">
                    {seenReceipts.map((receipt) => {
                      const name = receipt.name || receipt.username || "Member";

                      return (
                        <div
                          key={receipt.Student_ID}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {receipt.Profile_Pic ? (
                              <img
                                src={receipt.Profile_Pic}
                                alt={name}
                                className="h-8 w-8 rounded-full border border-primary/10 object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/10">
                                <GradientAvatar
                                  name={name}
                                  alt={name}
                                  className="rounded-full"
                                  textClassName="text-xs"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-primary">
                                {name}
                              </p>
                              <p className="truncate text-[10px] text-primary/50 max-w-[8.5rem]">
                                @{receipt.username || "member"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-primary/50">
                              {formatDateTime(receipt.Seen_On)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-primary/10 bg-white p-2.5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="text-xs font-semibold text-primary">
                    Not seen yet
                  </h4>
                  <span className="text-[10px] text-primary/45">
                    {pendingReceipts.length}
                  </span>
                </div>

                {pendingReceipts.length === 0 ? (
                  <p className="text-xs text-primary/50">
                    Everyone has seen this message.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingReceipts.map((receipt) => {
                      const name = receipt.name || receipt.username || "Member";

                      return (
                        <div
                          key={receipt.Student_ID}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {receipt.Profile_Pic ? (
                              <img
                                src={receipt.Profile_Pic}
                                alt={name}
                                className="h-8 w-8 rounded-full border border-primary/10 object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 overflow-hidden rounded-full border border-primary/10">
                                <GradientAvatar
                                  name={name}
                                  alt={name}
                                  className="rounded-full"
                                  textClassName="text-xs"
                                />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-primary">
                                {name}
                              </p>
                              <p className="truncate text-[10px] text-primary/50 max-w-[8.5rem]">
                                @{receipt.username || "member"}
                              </p>
                            </div>
                          </div>
                          <p className="shrink-0 text-[10px] text-primary/40">
                            Delivered
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MessageInfoModal;
