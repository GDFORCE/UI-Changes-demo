import type { CSSProperties, ReactNode } from "react"
import { type Theme, themeStyle } from "./themes"

/**
 * Wraps a screen in a theme's tokens: injects the theme's font @import,
 * shared animation keyframes (reduced-motion aware), and CSS variables.
 */
export default function ThemeScope({
  theme,
  className = "",
  style,
  children,
}: {
  theme: Theme
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div className={className} style={{ ...themeStyle(theme), ...style }}>
      <style>{`
        @import url('${theme.fontImport}');
        @keyframes vsRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes vsDraw{to{stroke-dashoffset:0}}
        .vs-rise{animation:vsRise 900ms cubic-bezier(.2,.8,.2,1) both}
        .vs-draw{stroke-dasharray:300;stroke-dashoffset:300;animation:vsDraw 1400ms ease-out .15s forwards}
        @media (prefers-reduced-motion:reduce){
          .vs-rise,.vs-draw{animation:none}
          .vs-draw{stroke-dashoffset:0}
        }
      `}</style>
      {children}
    </div>
  )
}
