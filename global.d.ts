declare global {
  interface Window {
    /**
     * Custom ENV information added to the window object in root.tsx.
     *
     * Important: this type is optional because it may not be present in the case of handling
     * errors.
     */
    ENV?: {
      GIT_COMMIT?: string;
      NODE_ENV: string;
    };
  }
}

export {};
