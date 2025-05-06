import { Editor } from "@tinymce/tinymce-react";
import { useRef, useEffect, useState } from "react";
import { useProductDescription } from "@/hooks/useProductDescription";
import { Sparkles } from "lucide-react"; 

export default function ProductDescriptionEditor() {
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

  return (
    <div>
      {/* Sparkle Icon Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-3 px-3 py-2 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center"
        title="Generate AI Description"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
              Generate Product Description
            </h3>
            <div className="mb-3">
              <label className="block font-medium mb-1">Characteristics</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                rows={2}
                placeholder="e.g. Long battery life, waterproof, touch screen"
                value={characteristics}
                onChange={e => setCharacteristics(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Keywords</label>
              <input
                className="w-full border rounded px-2 py-1"
                placeholder="e.g. watch, smart, electronics"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-1 rounded bg-gray-200 text-gray-700"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-1 rounded bg-[#1E3A8A] text-white font-semibold"
                onClick={handleGenerate}
                disabled={loading || !characteristics}
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}

      <Editor
        apiKey="2wgwudekky0t8rfj7j0et4hk5jljft4ryqfzo4fxpwawi9px"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
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
            "styles | bold italic underline strikethrough forecolor | align | moreextras | code",
          toolbar_mode: "wrap",
          toolbar_items_size: "small",
          align: "left center right justify",
          setup: (editor) => {
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