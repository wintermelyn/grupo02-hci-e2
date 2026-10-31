import { matchRange } from './results'

export interface HighlightProps {
  text: string
  query: string
}

/** Marks what a search matched in a text, or leaves the text as it is. */
export function Highlight({ text, query }: HighlightProps) {
  const range = matchRange(text, query)
  if (!range) return text
  const [start, end] = range
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-[3px] bg-sand-deep text-inherit">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  )
}
