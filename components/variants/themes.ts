import type { CSSProperties } from "react"

/**
 * Shared token profiles for the four colorways.
 * Single source of truth so login / dashboard / signup stay in sync.
 * No purple gradients, no Inter — per design brief.
 */
export type ThemeKey =
  | "trust" | "luxury" | "warm" | "vibrant"
  | "forest" | "midnight" | "rose" | "plum" | "gold"
  | "slate" | "mint" | "crimson" | "lavender" | "carbon"

export interface Theme {
  key: ThemeKey
  name: string
  note: string
  dark?: boolean
  fontImport: string
  vars: Record<string, string>
}

export const THEMES: Theme[] = [
  {
    key: "trust",
    name: "Trust",
    note: "Medical white · oceanic blue · sterile teal",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#E6EFF5", "--surface": "#FFFFFF", "--surface-2": "#F1F7FB",
      "--ink": "#0A2233", "--muted": "#51707F", "--line": "#DCE7EE",
      "--primary": "#0E5C8A", "--primary-press": "#0A4A70", "--on-primary": "#FFFFFF",
      "--secondary": "#0B7D77", "--accent-from": "#13A89F", "--accent-to": "#0E5C8A",
      "--glow": "rgba(14,92,138,.18)",
      "--font-display": "'Fraunces',Georgia,serif", "--font-body": "'Public Sans',system-ui,sans-serif",
    },
  },
  {
    key: "luxury",
    name: "Luxury",
    note: "Midnight obsidian · neon coral glow",
    dark: true,
    fontImport:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#06070B", "--surface": "#0E1118", "--surface-2": "#171C27",
      "--ink": "#F2F4FA", "--muted": "#9AA3B5", "--line": "rgba(255,255,255,.09)",
      "--primary": "#FF6B5A", "--primary-press": "#FF8473", "--on-primary": "#1A0B08",
      "--secondary": "#FF9D6C", "--accent-from": "#FF5E7D", "--accent-to": "#FFA85C",
      "--glow": "rgba(255,107,90,.45)",
      "--font-display": "'Cormorant Garamond',Georgia,serif", "--font-body": "'Sora',system-ui,sans-serif",
    },
  },
  {
    key: "warm",
    name: "Warm",
    note: "Linen/oat · terracotta · clay rose",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#E9DFD0", "--surface": "#FBF6EE", "--surface-2": "#F2E8DA",
      "--ink": "#3A2A20", "--muted": "#8A6F5E", "--line": "#E4D6C4",
      "--primary": "#BC5A34", "--primary-press": "#A04A29", "--on-primary": "#FFF7F0",
      "--secondary": "#B97A72", "--accent-from": "#DE9358", "--accent-to": "#BC5A34",
      "--glow": "rgba(188,90,52,.18)",
      "--font-display": "'Fraunces',Georgia,serif", "--font-body": "'DM Sans',system-ui,sans-serif",
    },
  },
  {
    key: "vibrant",
    name: "Vibrant",
    note: "White · digital peach · hyper-orange",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#FFF1E9", "--surface": "#FFFFFF", "--surface-2": "#FFF6F1",
      "--ink": "#1A130E", "--muted": "#7C6A5E", "--line": "#FFE0D1",
      "--primary": "#FF5A1F", "--primary-press": "#E64A12", "--on-primary": "#FFFFFF",
      "--secondary": "#FF9E7A", "--accent-from": "#FFB088", "--accent-to": "#FF5A1F",
      "--glow": "rgba(255,90,31,.22)",
      "--font-display": "'Space Grotesk',system-ui,sans-serif", "--font-body": "'Sora',system-ui,sans-serif",
    },
  },
  {
    key: "forest",
    name: "Forest",
    note: "Sage white · deep emerald · moss green",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Work+Sans:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#E6EFE6", "--surface": "#FFFFFF", "--surface-2": "#EDF5ED",
      "--ink": "#14271B", "--muted": "#5A7060", "--line": "#D7E6D9",
      "--primary": "#1F7A4D", "--primary-press": "#185E3B", "--on-primary": "#FFFFFF",
      "--secondary": "#3E8A5B", "--accent-from": "#5FB97E", "--accent-to": "#1F7A4D",
      "--glow": "rgba(31,122,77,.18)",
      "--font-display": "'Newsreader',Georgia,serif", "--font-body": "'Work Sans',system-ui,sans-serif",
    },
  },
  {
    key: "midnight",
    name: "Midnight",
    note: "Deep navy dark · electric cyan glow",
    dark: true,
    fontImport:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#070B12", "--surface": "#0E141F", "--surface-2": "#18212F",
      "--ink": "#EAF1F8", "--muted": "#94A4B8", "--line": "rgba(255,255,255,.08)",
      "--primary": "#36C5D6", "--primary-press": "#5AD4E2", "--on-primary": "#06222A",
      "--secondary": "#6FE0D0", "--accent-from": "#3AA0FF", "--accent-to": "#36E0C8",
      "--glow": "rgba(54,197,214,.4)",
      "--font-display": "'Space Grotesk',system-ui,sans-serif", "--font-body": "'Sora',system-ui,sans-serif",
    },
  },
  {
    key: "rose",
    name: "Rose",
    note: "Blush white · raspberry · soft mauve",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#F7E8EC", "--surface": "#FFFBFC", "--surface-2": "#FBEDF1",
      "--ink": "#3A1722", "--muted": "#8A6470", "--line": "#F0D7DF",
      "--primary": "#B0214E", "--primary-press": "#8F1A40", "--on-primary": "#FFFFFF",
      "--secondary": "#B0556E", "--accent-from": "#E78AA3", "--accent-to": "#B0214E",
      "--glow": "rgba(176,33,78,.18)",
      "--font-display": "'Playfair Display',Georgia,serif", "--font-body": "'Work Sans',system-ui,sans-serif",
    },
  },
  {
    key: "plum",
    name: "Plum",
    note: "Aubergine dark · orchid · magenta curve",
    dark: true,
    fontImport:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#0C0712", "--surface": "#150D1E", "--surface-2": "#21162E",
      "--ink": "#F2ECF8", "--muted": "#A595B5", "--line": "rgba(255,255,255,.08)",
      "--primary": "#B57BE8", "--primary-press": "#C796F0", "--on-primary": "#1A0B26",
      "--secondary": "#D9A7F0", "--accent-from": "#C77DFF", "--accent-to": "#FF7AC6",
      "--glow": "rgba(181,123,232,.4)",
      "--font-display": "'Cormorant Garamond',Georgia,serif", "--font-body": "'Sora',system-ui,sans-serif",
    },
  },
  {
    key: "gold",
    name: "Gold",
    note: "Warm cream · bronze amber · mustard",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#F4ECD8", "--surface": "#FEFBF2", "--surface-2": "#F3E9D2",
      "--ink": "#322817", "--muted": "#877A5C", "--line": "#E7DBBF",
      "--primary": "#A9791C", "--primary-press": "#8A6113", "--on-primary": "#FFFBF2",
      "--secondary": "#9C7A34", "--accent-from": "#E0B85C", "--accent-to": "#A9791C",
      "--glow": "rgba(169,121,28,.18)",
      "--font-display": "'Fraunces',Georgia,serif", "--font-body": "'Public Sans',system-ui,sans-serif",
    },
  },
  {
    key: "slate",
    name: "Slate",
    note: "Cool grey · charcoal · steel blue",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#E7EAEE", "--surface": "#FFFFFF", "--surface-2": "#F1F4F7",
      "--ink": "#1A2230", "--muted": "#5C6878", "--line": "#DBE1E8",
      "--primary": "#334155", "--primary-press": "#232E3D", "--on-primary": "#FFFFFF",
      "--secondary": "#4E657F", "--accent-from": "#7C93AE", "--accent-to": "#334155",
      "--glow": "rgba(51,65,85,.18)",
      "--font-display": "'Space Grotesk',system-ui,sans-serif", "--font-body": "'Manrope',system-ui,sans-serif",
    },
  },
  {
    key: "mint",
    name: "Mint",
    note: "Fresh mint · teal-green · aqua",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#E2F2EE", "--surface": "#FBFFFE", "--surface-2": "#ECF7F3",
      "--ink": "#10302A", "--muted": "#557B72", "--line": "#D2E9E2",
      "--primary": "#0E8E7A", "--primary-press": "#0A6F5F", "--on-primary": "#FFFFFF",
      "--secondary": "#2C9580", "--accent-from": "#5FD3B5", "--accent-to": "#0E8E7A",
      "--glow": "rgba(14,142,122,.18)",
      "--font-display": "'Outfit',system-ui,sans-serif", "--font-body": "'Sora',system-ui,sans-serif",
    },
  },
  {
    key: "crimson",
    name: "Crimson",
    note: "Warm ivory · deep crimson · ruby",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#F6E9E4", "--surface": "#FFFCFB", "--surface-2": "#F6E7E1",
      "--ink": "#361613", "--muted": "#8A625B", "--line": "#EFD6CD",
      "--primary": "#B02418", "--primary-press": "#8E1B12", "--on-primary": "#FFFFFF",
      "--secondary": "#B0564A", "--accent-from": "#E68A6F", "--accent-to": "#B02418",
      "--glow": "rgba(176,36,24,.18)",
      "--font-display": "'Playfair Display',Georgia,serif", "--font-body": "'DM Sans',system-ui,sans-serif",
    },
  },
  {
    key: "lavender",
    name: "Lavender",
    note: "Soft lilac · indigo · periwinkle",
    fontImport:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#EAEAF6", "--surface": "#FDFCFF", "--surface-2": "#EFEEF9",
      "--ink": "#1F1B33", "--muted": "#6A6588", "--line": "#DEDCEF",
      "--primary": "#5247C4", "--primary-press": "#3F35A3", "--on-primary": "#FFFFFF",
      "--secondary": "#6A60C8", "--accent-from": "#9A8FEC", "--accent-to": "#5247C4",
      "--glow": "rgba(82,71,196,.18)",
      "--font-display": "'Outfit',system-ui,sans-serif", "--font-body": "'Manrope',system-ui,sans-serif",
    },
  },
  {
    key: "carbon",
    name: "Carbon",
    note: "Pure black · electric lime · spring green",
    dark: true,
    fontImport:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Sora:wght@400;500;600&display=swap",
    vars: {
      "--bg": "#000000", "--surface": "#0B0D0A", "--surface-2": "#15180F",
      "--ink": "#F2F5EC", "--muted": "#9AA38C", "--line": "rgba(255,255,255,.08)",
      "--primary": "#C6F03A", "--primary-press": "#D6FA5E", "--on-primary": "#14210A",
      "--secondary": "#A9D94E", "--accent-from": "#C6F03A", "--accent-to": "#5CE0A0",
      "--glow": "rgba(198,240,58,.4)",
      "--font-display": "'Space Grotesk',system-ui,sans-serif", "--font-body": "'Sora',system-ui,sans-serif",
    },
  },
]

export const THEME_MAP: Record<ThemeKey, Theme> = Object.fromEntries(
  THEMES.map((t) => [t.key, t]),
) as Record<ThemeKey, Theme>

/** Build the inline style object (CSS custom properties) for a theme scope. */
export function themeStyle(theme: Theme): CSSProperties {
  return { ...theme.vars, fontFamily: "var(--font-body)", color: "var(--ink)" } as CSSProperties
}
