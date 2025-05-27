import { Editor } from "@tinymce/tinymce-react";
import { useRef, useEffect, useState } from "react";
import { useProductDescription } from "@/hooks/useProductDescription";
import { Sparkles } from "lucide-react"; 

interface ProductDescriptionEditorProps {
  onDescriptionChange?: (content: string) => void;
}

export default function ProductDescriptionEditor({ onDescriptionChange }: ProductDescriptionEditorProps) {
  const editorRef = useRef<any>(null);
  const { loading, description, error, generate } = useProductDescription();

  const [open, setOpen] = useState(false);
  const [characteristics, setCharacteristics] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (description && editorRef.current) {
      editorRef.current.setContent(description);
    }
  }, [description]);

  const handleGenerate = async () => {
    await generate({
      productName: "Smart Watch",
      category: "Electronics",
      features: characteristics,
      keywords: keywords,
    });
    setOpen(false);
  };

  const handleEditorChange = (content: string) => {
    onDescriptionChange?.(content);
  };

  return (
    <div>
      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90vw] max-w-md transform transition-all duration-300 scale-100 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <Sparkles className="w-6 h-6 text-[#1E3A8A] animate-pulse" />
                Generate Product Description
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block font-medium text-gray-700">Characteristics</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="e.g. Long battery life, waterproof, touch screen"
                  value={characteristics}
                  onChange={e => setCharacteristics(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-gray-700">Keywords</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200"
                  placeholder="e.g. watch, smart, electronics"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-[#1E3A8A] text-white font-medium hover:bg-[#1E3A8A]/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleGenerate}
                  disabled={loading || !characteristics}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Editor
        apiKey="2wgwudekky0t8rfj7j0et4hk5jljft4ryqfzo4fxpwawi9px"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
        onEditorChange={handleEditorChange}
        init={{
          directionality: "ltr",
          language: "en",
          height: 200,
          menubar: false,
          branding: false,
          statusbar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "fullscreen",
            "insertdatetime",
            "table",
            "code",
            "help",
            "wordcount",
            "emoticons",
          ],
          toolbar:
            "styles | bold italic underline strikethrough forecolor | align | moreextras | code | generate",
          toolbar_mode: "wrap",
          toolbar_items_size: "small",
          align: "left center right justify",
          setup: (editor) => {
            editor.ui.registry.addButton("generate", {
              icon: "sparkles",
              tooltip: "Generate AI Description",
              onAction: () => setOpen(true),
              text: "✨",
              style: "font-size: 16px; color: #1E3A8A;"
            });
            
            editor.ui.registry.addMenuButton("moreextras", {
              text: "\u2026",
              tooltip: "More options",
              style: "font-size: 20px; font-weight: bold;",
              fetch: (callback) => {
                const items = [
                  {
                    type: "nestedmenuitem",
                    text: "Lists",
                    icon: "unordered-list",
                    getSubmenuItems: () => [
                      {
                        type: "menuitem",
                        text: "Bullet list",
                        icon: "unordered-list",
                        onAction: () => editor.execCommand("InsertUnorderedList"),
                      },
                      {
                        type: "menuitem",
                        text: "Numbered list",
                        icon: "ordered-list",
                        onAction: () => editor.execCommand("InsertOrderedList"),
                      },
                    ],
                  },
                  {
                    type: "menuitem",
                    text: "Emoji",
                    icon: "emoji",
                    onAction: () => editor.execCommand("mceEmoticons"),
                  },
                  {
                    type: "menuitem",
                    text: "Fullscreen",
                    icon: "fullscreen",
                    onAction: () => editor.execCommand("mceFullScreen"),
                  },
                ];
                callback(items);
              },
            });
          },
        }}
      />
    </div>
  );
}