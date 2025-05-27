"use client"

interface CustomizationPanelProps {
  customization: {
    backgroundColor?: string
    textColor?: string
    fontSize?: string
    fontFamily?: string
  }
  onCustomizationChange: (customization: any) => void
}

export function CustomizationPanel({ customization, onCustomizationChange }: CustomizationPanelProps) {
  const fontOptions = [
    { value: "", label: "Default Font" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
  ]

  const fontSizeOptions = [
    { value: "", label: "Default Size" },
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "extra-large", label: "Extra Large" },
  ]

  const colorPresets = [
    { name: "Default", bg: "", text: "" },
    { name: "Ocean", bg: "#0ea5e9", text: "#ffffff" },
    { name: "Forest", bg: "#059669", text: "#ffffff" },
    { name: "Sunset", bg: "#f59e0b", text: "#1f2937" },
    { name: "Rose", bg: "#e11d48", text: "#ffffff" },
    { name: "Purple", bg: "#7c3aed", text: "#ffffff" },
    { name: "Dark", bg: "#1f2937", text: "#ffffff" },
  ]

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900">Customize Your Ad</h3>

      {/* Color Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Color Presets</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() =>
                onCustomizationChange({
                  ...customization,
                  backgroundColor: preset.bg,
                  textColor: preset.text,
                })
              }
              className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors text-center"
              style={{
                backgroundColor: preset.bg || "#ffffff",
                color: preset.text || "#000000",
              }}
            >
              <div className="text-xs font-medium">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customization.backgroundColor || "#ffffff"}
              onChange={(e) =>
                onCustomizationChange({
                  ...customization,
                  backgroundColor: e.target.value,
                })
              }
              className="w-12 h-10 rounded border border-gray-300"
            />
            <input
              type="text"
              value={customization.backgroundColor || ""}
              onChange={(e) =>
                onCustomizationChange({
                  ...customization,
                  backgroundColor: e.target.value,
                })
              }
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customization.textColor || "#000000"}
              onChange={(e) =>
                onCustomizationChange({
                  ...customization,
                  textColor: e.target.value,
                })
              }
              className="w-12 h-10 rounded border border-gray-300"
            />
            <input
              type="text"
              value={customization.textColor || ""}
              onChange={(e) =>
                onCustomizationChange({
                  ...customization,
                  textColor: e.target.value,
                })
              }
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={customization.fontFamily || ""}
            onChange={(e) =>
              onCustomizationChange({
                ...customization,
                fontFamily: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
          <select
            value={customization.fontSize || ""}
            onChange={(e) =>
              onCustomizationChange({
                ...customization,
                fontSize: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onCustomizationChange({})}
        className="w-full px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Reset to Default
      </button>
    </div>
  )
}
