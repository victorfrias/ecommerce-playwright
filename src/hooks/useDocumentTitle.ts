import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Halden' ? 'Halden' : `${title} · Halden`
  }, [title])
}
