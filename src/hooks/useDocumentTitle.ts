import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title === 'Halden' || title === 'User Area'
      ? title
      : `${title} · Halden`
  }, [title])
}
