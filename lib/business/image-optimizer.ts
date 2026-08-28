export type BusinessImageKind =
  | "logo"
  | "cover"
  | "menu"
  | "memory";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const imageSettings = {
  logo: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
  },

  cover: {
    maxWidth: 1920,
    maxHeight: 1200,
    quality: 0.82,
  },

  menu: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.82,
  },

  memory: {
    maxWidth: 1440,
    maxHeight: 1800,
    quality: 0.82,
  },
} satisfies Record<
  BusinessImageKind,
  {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  }
>;

export async function optimizeBusinessImage(
  file: File,
  kind: BusinessImageKind,
): Promise<File> {
  validateImage(file);

  const bitmap =
    await createImageBitmap(
      file,
    );

  try {
    const settings =
      imageSettings[kind];

    const scale = Math.min(
      1,
      settings.maxWidth /
        bitmap.width,
      settings.maxHeight /
        bitmap.height,
    );

    const width = Math.max(
      1,
      Math.round(
        bitmap.width *
          scale,
      ),
    );

    const height = Math.max(
      1,
      Math.round(
        bitmap.height *
          scale,
      ),
    );

    const canvas =
      document.createElement(
        "canvas",
      );

    canvas.width =
      width;

    canvas.height =
      height;

    const context =
      canvas.getContext(
        "2d",
      );

    if (!context) {
      throw new Error(
        "Your browser could not process this image.",
      );
    }

    context.imageSmoothingEnabled =
      true;

    context.imageSmoothingQuality =
      "high";

    context.drawImage(
      bitmap,
      0,
      0,
      width,
      height,
    );

    const blob =
      await createWebPBlob(
        canvas,
        settings.quality,
      );

    return new File(
      [
        blob,
      ],
      createOptimizedFilename(
        file,
        kind,
      ),
      {
        type:
          "image/webp",

        lastModified:
          Date.now(),
      },
    );
  } finally {
    bitmap.close();
  }
}

function validateImage(
  file: File,
) {
  if (
    !ALLOWED_TYPES.includes(
      file.type,
    )
  ) {
    throw new Error(
      "Please choose a JPG, PNG, or WebP image.",
    );
  }

  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    throw new Error(
      "The image must be 5 MB or smaller.",
    );
  }
}

function createWebPBlob(
  canvas: HTMLCanvasElement,
  quality: number,
) {
  return new Promise<Blob>(
    (
      resolve,
      reject,
    ) => {
      canvas.toBlob(
        (
          blob,
        ) => {
          if (!blob) {
            reject(
              new Error(
                "Image optimization failed.",
              ),
            );

            return;
          }

          resolve(
            blob,
          );
        },
        "image/webp",
        quality,
      );
    },
  );
}

function createOptimizedFilename(
  file: File,
  kind: BusinessImageKind,
) {
  if (
    kind === "logo" ||
    kind === "cover"
  ) {
    return `${kind}.webp`;
  }

  if (
    kind === "memory"
  ) {
    return "memory.webp";
  }

  const originalName =
    file.name
      .replace(
        /\.[^/.]+$/,
        "",
      )
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9-_]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  return `${
    originalName ||
    "menu-item"
  }.webp`;
}

export function formatFileSize(
  bytes: number,
) {
  if (
    bytes <
    1024
  ) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${Math.round(
      bytes / 1024,
    )} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}