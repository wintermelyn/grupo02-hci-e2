import type { HTMLAttributes } from 'react'
import { cx } from './cx'

/** The ribbon that marks what is active. Decorative: its meaning is always also in the text. */
export function Ribbon({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span aria-hidden className={cx('ribbon block', className)} {...rest} />
}
