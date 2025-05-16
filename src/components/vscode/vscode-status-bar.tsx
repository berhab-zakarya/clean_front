interface VSCodeStatusBarProps {
  filePath: string | null
  fileType: string
}

export function VSCodeStatusBar({ filePath, fileType }: VSCodeStatusBarProps) {
  // Map file extensions to language names
  const getLanguage = (ext: string): string => {
    const languages: Record<string, string> = {
      ts: "TypeScript",
      tsx: "TypeScript React",
      js: "JavaScript",
      jsx: "JavaScript React",
      css: "CSS",
      html: "HTML",
      json: "JSON",
      md: "Markdown",
    }

    return languages[ext] || ext.toUpperCase()
  }

  return (
    <div className="flex items-center px-4 py-1 bg-gray-800 text-gray-400 text-xs">
      <div className="flex-1">{filePath && <span>UTF-8</span>}</div>
      <div className="flex space-x-4">
        <span>{getLanguage(fileType)}</span>
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
      </div>
    </div>
  )
}
