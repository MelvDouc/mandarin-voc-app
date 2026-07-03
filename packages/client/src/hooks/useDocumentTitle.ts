import { useEffect } from "react";

export default function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} | Mandarin Voc App`;
  });
}