
import { jsPDF } from "jspdf";

import type { TripWorkspaceData } from "@/types/trip-workspace";
import type { TripExportSettings } from "@/types/trip-export";

type ProtectedBlock = {
  top: number;
  bottom: number;
};

const BACKGROUND = "#141218";

export async function exportTripToPdf(
  trip: TripWorkspaceData,
  _settings: TripExportSettings,
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PDF export requires a browser.");
  }

  const { default: html2canvas } = await import(
    "html2canvas-pro"
  );

  const source = document.querySelector<HTMLElement>(
    "[data-trip-export-document]",
  );

  if (!source) {
    throw new Error("Export preview not found.");
  }

  await document.fonts.ready;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const drawPageBackground = () => {
    pdf.setFillColor(20, 18, 24);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
  };

  const margin = 5;
  const footerHeight = 13;

  const printableWidth = pageWidth - margin * 2;
  const printableHeight =
    pageHeight - margin * 2 - footerHeight;

  // Measurements collected from the PDF capture clone.
  let capturedWidth = 0;
  let capturedHeroHeight = 0;

  const measuredBlocks: ProtectedBlock[] = [];

  const canvas = await html2canvas(source, {
    scale: 3,
    useCORS: true,
    allowTaint: false,
    backgroundColor: BACKGROUND,
    logging: false,

    windowWidth: Math.max(
      document.documentElement.clientWidth,
      1000,
    ),

    onclone: (clonedDocument) => {
      const root =
        clonedDocument.querySelector<HTMLElement>(
          "[data-trip-export-document]",
        );

      if (!root) return;

      Object.assign(root.style, {
        height: "auto",
        maxHeight: "none",
        overflow: "visible",
        boxShadow: "none",
        border: "none",
        borderRadius: "0",
      });

      // Hide the on-screen Preview footer.
      const footer = root.lastElementChild;

      if (
        footer instanceof HTMLElement &&
        footer.textContent?.includes("Preview")
      ) {
        footer.style.display = "none";
      }

      const rootRect = root.getBoundingClientRect();

      const hero = root.firstElementChild;

      if (hero instanceof HTMLElement) {
        capturedHeroHeight =
          hero.getBoundingClientRect().height;
      }

      const pageHeightCss =
        (printableHeight / printableWidth) *
        rootRect.width;

      const measure = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();

        if (rect.height <= 0) return;

        measuredBlocks.push({
          top: Math.max(
            0,
            rect.top - rootRect.top,
          ),
          bottom: rect.bottom - rootRect.top,
        });
      };

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("section"),
      );

      const findSection = (heading: string) =>
        sections.find(
          (section) =>
            section.querySelector("h2")
              ?.textContent?.trim() === heading,
        );

      // Keep each itinerary day together.
      const itinerary = findSection(
        "Itinerary Overview",
      );

      if (itinerary) {
        const timeline = Array.from(
          itinerary.querySelectorAll<HTMLElement>("div"),
        ).find((element) =>
          element.classList.contains("border-l"),
        );

        if (timeline) {
          Array.from(timeline.children).forEach(
            (element) => {
              if (element instanceof HTMLElement) {
                measure(element);
              }
            },
          );
        }
      }

      // Keep the entire budget together if it fits.
      const budget = findSection("Cost Breakdown");

      if (budget) {
        const budgetHeight =
          budget.getBoundingClientRect().height;

        if (budgetHeight <= pageHeightCss) {
          measure(budget);
        } else {
          // For long budgets, protect complete grid rows.
          const grids = Array.from(
            budget.querySelectorAll<HTMLElement>(
              ".grid",
            ),
          );

          for (const grid of grids) {
            const cards = Array.from(
              grid.children,
            ).filter(
              (child): child is HTMLElement =>
                child instanceof HTMLElement,
            );

            // Group cards by their visual row.
            const rows = new Map<
              number,
              HTMLElement[]
            >();

            for (const card of cards) {
              const top = Math.round(
                card.getBoundingClientRect().top,
              );

              const row = rows.get(top) ?? [];

              row.push(card);
              rows.set(top, row);
            }

            for (const row of rows.values()) {
              const first = row[0];
              const last = row.reduce(
                (bottommost, card) =>
                  card.getBoundingClientRect().bottom >
                  bottommost.getBoundingClientRect().bottom
                    ? card
                    : bottommost,
                first,
              );

              const firstRect =
                first.getBoundingClientRect();

              const lastRect =
                last.getBoundingClientRect();

              measuredBlocks.push({
                top: firstRect.top - rootRect.top,
                bottom: lastRect.bottom - rootRect.top,
              });
            }
          }
        }
      }

      // Keep complete flight and hotel sections together.
      for (const heading of [
        "Flight Details",
        "Accommodation Details",
      ]) {
        const section = findSection(heading);

        if (!section) continue;

        if (
          section.getBoundingClientRect().height <=
          pageHeightCss
        ) {
          measure(section);
        } else {
          // Large sections: protect individual cards.
          section
            .querySelectorAll<HTMLElement>(
              ".rounded-xl",
            )
            .forEach(measure);
        }
      }
    },
  });

  if (!canvas.width || !canvas.height) {
    throw new Error(
      "Unable to capture the export preview.",
    );
  }

  const pixelsPerMm =
    canvas.width / printableWidth;

  const pageHeightPixels = Math.floor(
    printableHeight * pixelsPerMm,
  );

  // Convert cloned DOM coordinates to canvas pixels.
  const scale =
    canvas.width / (capturedWidth || source.clientWidth);

  const protectedBlocks = measuredBlocks
    .map((block) => ({
      top: Math.max(
        0,
        Math.floor(block.top * scale),
      ),
      bottom: Math.min(
        canvas.height,
        Math.ceil(block.bottom * scale),
      ),
    }))
    .filter((block) => block.bottom > block.top)
    .sort((a, b) => a.top - b.top);

  let sourceY = 0;
  let pageNumber = 0;

  while (sourceY < canvas.height) {
    const maximumEnd = Math.min(
      sourceY + pageHeightPixels,
      canvas.height,
    );

    let pageEnd = maximumEnd;

    if (maximumEnd < canvas.height) {
      const crossing = protectedBlocks
        .filter(
          (block) =>
            block.top < maximumEnd &&
            block.bottom > maximumEnd &&
            block.top > sourceY,
        )
        .sort((a, b) => a.top - b.top);

      if (crossing.length > 0) {
        // Break before the earliest crossing block.
        pageEnd = Math.max(
          sourceY,
          crossing[0].top - 8,
        );
      }
    }

    // Avoid zero-height pages.
    if (pageEnd <= sourceY) {
      pageEnd = maximumEnd;
    }

    const sliceHeight = pageEnd - sourceY;

    const pageCanvas =
      document.createElement("canvas");

    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const context = pageCanvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Unable to prepare the PDF page.",
      );
    }

    context.fillStyle = BACKGROUND;

    context.fillRect(
      0,
      0,
      pageCanvas.width,
      pageCanvas.height,
    );

    context.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    if (pageNumber > 0) {
      pdf.addPage();
    }

    drawPageBackground();

    const imageData = pageCanvas.toDataURL("image/png");

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      margin,
      printableWidth,
      sliceHeight / pixelsPerMm,
    );

    if (pageNumber === 0 && capturedHeroHeight > 0) {
      const heroHeightPixels = Math.min(
        Math.ceil(capturedHeroHeight * scale),
        canvas.height,
        sliceHeight,
      );

      const heroCanvas = document.createElement("canvas");

      heroCanvas.width = canvas.width;
      heroCanvas.height = heroHeightPixels;

      const heroContext = heroCanvas.getContext("2d");

      if (!heroContext) {
        throw new Error("Unable to render PDF cover.");
      }

      heroContext.drawImage(
        canvas,
        0,
        0,
        canvas.width,
        heroHeightPixels,
        0,
        0,
        canvas.width,
        heroHeightPixels,
      );

      const heroImage = heroCanvas.toDataURL(
        "image/jpeg",
        1.0,
      );

      const heroHeightMm =
        heroHeightPixels / pixelsPerMm;

      const heroOverlap = 0.5;

      pdf.addImage(
        heroImage,
        "JPEG",
        0,
        0,
        pageWidth,
        margin + heroHeightMm + heroOverlap,
      );
    }

    sourceY = pageEnd;
    pageNumber += 1;
  }

  // Professional footer on every page.
  const totalPages = pdf.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    pdf.setPage(page);

    // Footer divider color
    pdf.setDrawColor(65, 65, 78);
    pdf.setLineWidth(0.2);

    pdf.line(
      margin,
      pageHeight - 15,
      pageWidth - margin,
      pageHeight - 15,
    );

    // Footer text
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(175, 180, 195);

    pdf.text(
      "Generated by AIX Voyage",
      margin,
      pageHeight - 9,
    );

    pdf.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 9,
      { align: "right" },
    );
  }

  const safeTripId = trip.id.replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );

  pdf.save(`AIX-Voyage-${safeTripId}.pdf`);
}