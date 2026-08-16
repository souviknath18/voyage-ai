"use client";

import {
  ArrowRight,
  Check,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";

import {
  Button,
  ThumbnailImage,
} from "@/components/ui";

import type {
  AssistantProposalData,
} from "@/types/trip-assistant";

interface AssistantProposalProps {
  proposal: AssistantProposalData;

  onAcceptAction: () => void;
  onRejectAction: () => void;
  onDiscussAction?: () => void;
}

export default function AssistantProposal({
  proposal,
  onAcceptAction,
  onRejectAction,
  onDiscussAction,
}: AssistantProposalProps) {
  return (
    <div className="flex items-start gap-3">
      {/* VoyageAI Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185]">
        <Sparkles size={14} />
      </div>

      {/* Proposal */}
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/[0.05]">
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#fb7185]">
                VoyageAI
              </span>
            </div>

            <h3 className="mt-1.5 text-sm font-semibold text-[#e6e0e8]">
              {proposal.title}
            </h3>

            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#948e9c]">
              {proposal.description}
            </p>
          </div>

          {/* Comparison */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
            {/* Current */}
            <ProposalOption
              option={proposal.current}
              current
            />

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ArrowRight
                  size={13}
                  className="rotate-90 text-[#7f8798] md:rotate-0"
                />
              </div>
            </div>

            {/* VoyageAI Pick */}
            <ProposalOption
              option={proposal.proposed}
            />
          </div>

          {/* Budget Impact */}
          {proposal.impact && (
            <div className="mt-4 rounded-lg border border-[#fcd34d]/20 bg-[#fcd34d]/[0.05] px-3 py-2.5">
              <p className="text-[11px] leading-4 text-[#cbc4d2]">
                <span className="font-medium text-[#fcd34d]">
                  Budget impact:
                </span>{" "}
                {proposal.impact}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={onAcceptAction}
            >
              <Check size={14} />

              Accept Changes
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRejectAction}
            >
              <X size={14} />

              Keep Current
            </Button>

            {onDiscussAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDiscussAction}
              >
                <MessageCircle
                  size={14}
                />

                Discuss Options
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProposalOption({
  option,
  current = false,
}: {
  option: AssistantProposalData["current"];

  current?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        current
          ? "border-white/10 bg-white/[0.025]"
          : "border-[#fb7185]/25 bg-[#fb7185]/[0.05]"
      }`}
    >
      {/* Image */}
      {option.image && (
        <div className="relative">
          <ThumbnailImage
            src={option.image}
            alt={option.title}
            className="h-28 w-full rounded-none"
            imageClassName="object-cover"
          />

          {/* Type */}
          <span
            className={`absolute right-2 top-2 rounded-md border px-2 py-1 text-[9px] font-semibold ${
              current
                ? "border-white/10 bg-[#070B18]/80 text-[#cbc4d2]"
                : "border-[#fb7185]/25 bg-[#070B18]/85 text-[#fb7185]"
            } backdrop-blur-md`}
          >
            {current
              ? "Current"
              : option.label ??
                "VoyageAI Pick"}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-3.5">
        {/* Label without image */}
        {!option.image && (
          <span
            className={`inline-flex rounded-md border px-2 py-1 text-[9px] font-semibold ${
              current
                ? "border-white/10 bg-white/[0.04] text-[#948e9c]"
                : "border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]"
            }`}
          >
            {current
              ? "Current"
              : option.label ??
                "VoyageAI Pick"}
          </span>
        )}

        {/* Hotel Name */}
        <h4
          className={`text-sm font-semibold leading-5 text-[#e6e0e8] ${
            !option.image
              ? "mt-3"
              : ""
          }`}
        >
          {option.title}
        </h4>

        {/* Room */}
        {option.subtitle && (
          <p
            className={`mt-1 text-xs font-medium ${
              current
                ? "text-[#cbc4d2]"
                : "text-[#d1bcff]"
            }`}
          >
            {option.subtitle}
          </p>
        )}

        {/* Hotel Details */}
        {option.details &&
          option.details.length >
            0 && (
            <div className="mt-2.5 space-y-1.5">
              {option.details.map(
                (
                  detail,
                  index,
                ) => (
                  <div
                    key={`${detail}-${index}`}
                    className="flex items-start gap-2"
                  >
                    <span
                      className={`mt-[6px] h-1 w-1 shrink-0 rounded-full ${
                        current
                          ? "bg-[#7f8798]"
                          : "bg-[#fb7185]"
                      }`}
                    />

                    <p className="text-[11px] leading-4 text-[#948e9c]">
                      {detail}
                    </p>
                  </div>
                ),
              )}
            </div>
          )}

        {/* Price */}
        {option.amount && (
          <div className="mt-3 border-t border-white/[0.07] pt-3">
            <p
              className={`text-sm font-semibold ${
                current
                  ? "text-[#e6e0e8]"
                  : "text-[#fcd34d]"
              }`}
            >
              {option.amount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}