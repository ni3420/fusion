"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  ImagePlus, 
  Smile, 
  SendHorizontal, 
  X,
  Type,
  Video,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Loader2,
  Search,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export interface EditorValue {
  body: string;
  image: File | null;
  gifUrl?: string | null;
}

interface EditorProps {
  placeholder?: string;
  onSubmit: (values: EditorValue) => void;
  onCancel?: () => void;
  disabled?: boolean;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export default function Editor({
  placeholder = "Write a message...",
  onSubmit,
  onCancel,
  disabled = false,
  innerRef,
}: EditorProps) {
  const [image, setImage] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [fontSize, setFontSize] = useState("normal");

  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState<string[]>([]);
  const [gifsLoading, setGifsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    placeholder,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none text-sm font-medium text-neutral-800 dark:text-neutral-200 outline-none min-h-[52px] px-4 py-3.5 bg-transparent",
      },
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  useEffect(() => {
    const fetchGifs = async () => {
      setGifsLoading(true);
      try {
        const apiKey = "cw78B78ba4DvgPL6vA5ZST9uhAs7qm86"; 
        const endpoint = gifSearch.trim() 
          ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(gifSearch)}&limit=10&rating=g`
          : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10&rating=g`;

        const res = await fetch(endpoint);
        const json = await res.json();
        
        if (json.data) {
          const urls = json.data.map((item: any) => item.images.fixed_height.url);
          setGifs(urls);
        }
      } catch (error) {
        console.error("Error streaming Giphy assets:", error);
      } finally {
        setGifsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchGifs();
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [gifSearch]);

  useEffect(() => {
    if (innerRef) {
      innerRef.current = containerRef.current;
    }
  }, [innerRef]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGifUrl(null);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setImage(null);
    setGifUrl(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const insertEmoji = (emoji: string) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    }
  };

  const insertGif = (url: string) => {
    handleRemoveMedia();
    setGifUrl(url);
  };

  const getFontSizeClass = () => {
    if (fontSize === "small") return "text-xs";
    if (fontSize === "large") return "text-base";
    if (fontSize === "huge") return "text-lg font-bold";
    return "text-sm";
  };

  const htmlContent = editor?.getHTML() || "";
  const textContent = editor?.getText() || "";
  const isEmpty = textContent.trim().length === 0 && !image && !gifUrl;

  const handleSubmitData = () => {
    if (isEmpty || disabled || !editor) return;
    onSubmit({ body: htmlContent, image, gifUrl });
    editor.commands.clearContent();
    handleRemoveMedia();
    setFontSize("normal");
  };

  if (!editor) {
    return (
      <div className="h-28 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950 flex items-center justify-center animate-fade-in-fast">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div ref={containerRef} className="flex flex-col w-full group/editor">
        <div 
          className={cn(
            "flex flex-col border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/40 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 shadow-xs",
            isFocused && "border-neutral-400 dark:border-neutral-700 ring-4 ring-neutral-400/5 dark:ring-neutral-200/5 bg-white dark:bg-neutral-950"
          )}
        >
          {(imagePreview || gifUrl) && (
            <div className="p-4 bg-neutral-50/40 dark:bg-neutral-900/10 border-b border-neutral-100 dark:border-neutral-900 flex items-center animate-fade-in-fast">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-background group/image shadow-xs">
                <img src={imagePreview || gifUrl || ""} alt="Media upload node" className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105" />
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-1 right-1 p-1 bg-black/70 rounded-md text-white hover:bg-black/90 opacity-100 md:opacity-0 md:group-hover/image:opacity-100 transition-all duration-150 backdrop-blur-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <div className={cn("relative min-h-[48px]", getFontSizeClass())}>
            <EditorContent editor={editor} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 px-3 py-2 bg-neutral-50/30 dark:bg-neutral-900/10 border-t border-neutral-100 dark:border-neutral-900/60 select-none">
            <div className="flex flex-wrap items-center gap-0.5">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                disabled={disabled}
              />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  >
                    <ImagePlus className="h-4 w-4 stroke-[1.8]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px] font-semibold px-2 py-1 bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 rounded-md shadow-md border-0">
                  Attach Image
                </TooltipContent>
              </Tooltip>
              
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={disabled}
                          className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        >
                          <Smile className="h-4 w-4 stroke-[1.8]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px] font-semibold px-2 py-1 bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 rounded-md shadow-md border-0">
                        Emoji
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="p-0 border-none bg-transparent shadow-none w-auto max-w-[90vw] z-50">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
                    lazyLoadEmojis={true}
                    height={360}
                    width={300}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={disabled}
                          className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        >
                          <Video className="h-4 w-4 stroke-[1.8]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px] font-semibold px-2 py-1 bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 rounded-md shadow-md border-0">
                        GIFs
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-64 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 z-50 space-y-2 max-w-[90vw]">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                    <Input
                      placeholder="Search GIPHY..."
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      className="h-8 pl-8 text-xs font-medium focus-visible:ring-1 border-neutral-200 dark:border-neutral-800 bg-transparent"
                    />
                  </div>

                  <div className="h-40 overflow-y-auto custom-scrollbar">
                    {gifsLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                      </div>
                  ) : gifs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-neutral-400">
                      No matching GIFs found
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      {gifs.map((gif, index) => (
                        <button
                          key={index}
                          onClick={() => insertGif(gif)}
                          className="h-16 w-full rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-900 hover:opacity-80 transition-opacity"
                        >
                          <img src={gif} alt="Giphy Node" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={disabled}
                          className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        >
                          <Type className="h-4 w-4 stroke-[1.8]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px] font-semibold px-2 py-1 bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 rounded-md shadow-md border-0">
                        Font Size
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-36 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col gap-0.5 z-50">
                  {[
                    { label: "Small text", value: "small" },
                    { label: "Normal size", value: "normal" },
                    { label: "Large text", value: "large" },
                    { label: "Huge text", value: "huge" }
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setFontSize(size.value)}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                        fontSize === size.value 
                          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50" 
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("bold") && "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50")}
                >
                  <Bold className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("italic") && "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50")}
                >
                  <Italic className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("strike") && "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50")}
                >
                  <Strikethrough className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("bulletList") && "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("orderedList") && "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50")}
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("codeBlock") && "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50")}
                >
                  <Code className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end ml-auto gap-2 w-full sm:w-auto border-t sm:border-t-0 border-neutral-100 dark:border-neutral-900/60 pt-2 sm:pt-0">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={disabled}
                  className="h-8 text-xs font-semibold rounded-lg px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="button"
                size="icon"
                disabled={isEmpty || disabled}
                onClick={handleSubmitData}
                className={cn(
                  "h-8 w-8 rounded-xl transition-all duration-200 shadow-xs active:scale-[0.95] shrink-0",
                  isEmpty 
                    ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600 cursor-not-allowed border border-transparent" 
                    : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 border border-neutral-900 dark:border-neutral-50"
                )}
              >
                <SendHorizontal className="h-3.5 w-3.5 stroke-[2]" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 px-1.5 select-none text-[10px] text-neutral-400 dark:text-neutral-500 font-medium tracking-tight opacity-0 group-hover/editor:opacity-100 transition-opacity duration-300 hidden sm:flex">
          <span><strong>Return</strong> to send • <strong>Shift + Return</strong> for new line</span>
        </div>
      </div>
    </TooltipProvider>
  );
}