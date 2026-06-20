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
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Placeholder from '@tiptap/extension-placeholder'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import Image from "next/image";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export interface EditorValue {
  body: string;
  image: File | null;
  gifUrl?: string | null;
}

interface EditorProps {
  placeholder?: string;
  defaultValue?: string;
  defaultGifUrl?: string | null;
  onSubmit: (values: EditorValue) => void;
  onCancel?: () => void;
  disabled?: boolean;
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export default function Editor({
  placeholder = "Write a message...",
  onSubmit,
  defaultValue = "",
  defaultGifUrl = null,
  onCancel,
  disabled = false,
  innerRef,
}: EditorProps) {
  const [image, setImage] = useState<File | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(defaultGifUrl);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [showFormatting, setShowFormatting] = useState(false);

  const [gifSearch, setGifSearch] = useState("");
  const [gifs, setGifs] = useState<string[]>([]);
  const [gifsLoading, setGifsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
     extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder,
    }),
  ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none text-[14px] font-normal text-neutral-800 dark:text-neutral-200 outline-none min-h-[44px] sm:min-h-[52px] px-4 py-3 bg-transparent",
      },
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  useEffect(() => {
    if (editor && defaultValue && editor.getHTML() !== defaultValue) {
      editor.commands.setContent(defaultValue);
    }
  }, [defaultValue, editor]);

  useEffect(() => {
    const fetchGifs = async () => {
      setGifsLoading(true);
      try {
        const apiKey = "cw78B78ba4DvgPL6vA5ZST9uhAs7qm86"; 
        const endpoint = gifSearch.trim() 
          ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(gifSearch)}&limit=12&rating=g`
          : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12&rating=g`;

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
      <div className="h-24 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div ref={containerRef} className="flex flex-col w-full group/editor">
        <div 
          className={cn(
            "flex flex-col border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl overflow-hidden transition-all duration-200 shadow-2xs",
            isFocused && "border-neutral-400 dark:border-neutral-700 ring-2 ring-neutral-400/5 dark:ring-neutral-200/5 bg-white dark:bg-neutral-900"
          )}
        >
          {/* Media Previews Wrapper */}
          {(imagePreview || gifUrl) && (
            <div className="p-3 bg-neutral-50/50 dark:bg-neutral-950/30 border-b border-neutral-100 dark:border-neutral-950 flex items-center animate-in fade-in duration-150">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-background group/image shadow-3xs">
                <Image src={imagePreview || gifUrl || ""} alt="Media payload preview" className="w-full h-full object-cover transition-transform duration-200 group-hover/image:scale-105" loading="eager"/>
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-1 right-1 p-1 bg-black/70 rounded-md text-white hover:bg-black/90 transition-all backdrop-blur-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Textarea Area Row */}
          <div className={cn("relative min-h-[44px] sm:min-h-[52px]", getFontSizeClass())}>
            <EditorContent editor={editor} />
          </div>

          {/* Expanded Rich Formatting Drawer Panel Row (Desktop & Mobile Active State) */}
          {showFormatting && (
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 bg-neutral-50/60 dark:bg-neutral-950/40 border-t border-neutral-100 dark:border-neutral-950/60 transition-all animate-in slide-in-from-top-1 duration-150">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("bold") && "bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")}
              >
                <Bold className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("italic") && "bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")}
              >
                <Italic className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("strike") && "bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")}
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </Button>
              <div className="h-3.5 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("bulletList") && "bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("orderedList") && "bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")}
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={cn("h-7 w-7 rounded-md text-neutral-500", editor.isActive("codeBlock") && "bg-neutral-200/60 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")}
              >
                <Code className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Control Docks Interaction Footer Toolbar */}
          <div className="flex items-center justify-between px-2 py-1.5 bg-neutral-50/40 dark:bg-neutral-950/20 border-t border-neutral-100 dark:border-neutral-950/60 select-none">
            <div className="flex items-center gap-0.5">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                disabled={disabled}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <ImagePlus className="h-4 w-4 stroke-[1.8]" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Smile className="h-4 w-4 stroke-[1.8]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="p-0 border-none bg-transparent shadow-none z-50 max-w-[100vw] sm:max-w-none">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
                    lazyLoadEmojis={true}
                    height={340}
                    width={280}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Video className="h-4 w-4 stroke-[1.8]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-[280px] p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 z-50 space-y-2 max-w-[90vw]">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                    <Input
                      placeholder="Search GIPHY..."
                      value={gifSearch}
                      onChange={(e) => setGifSearch(e.target.value)}
                      className="h-8 pl-8 text-xs font-medium focus-visible:ring-1 border-neutral-200 dark:border-neutral-800 bg-transparent"
                    />
                  </div>

                  <div className="h-36 overflow-y-auto grid grid-cols-2 gap-1 p-0.5">
                    {gifsLoading ? (
                      <div className="col-span-2 h-full flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                      </div>
                    ) : gifs.length === 0 ? (
                      <div className="col-span-2 h-full flex items-center justify-center text-[11px] text-neutral-400">
                        No matching GIFs found
                      </div>
                    ) : (
                      gifs.map((gif, index) => (
                        <button
                          key={index}
                          onClick={() => insertGif(gif)}
                          className="h-14 w-full rounded-md overflow-hidden border border-neutral-100 dark:border-neutral-900 hover:opacity-80 transition-opacity"
                        >
                          <img src={gif} alt="Giphy node asset" className="w-full h-full object-cover" />
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="h-8 w-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Type className="h-4 w-4 stroke-[1.8]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-36 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col gap-0.5 z-50">
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
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50" 
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              <div className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-1" />

              {/* Toggle Inline Formatting Trigger (Saves valuable space on mobile viewports) */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowFormatting(!showFormatting)}
                className={cn("h-8 w-8 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800", showFormatting && "bg-neutral-100 dark:bg-neutral-800 text-primary")}
              >
                <span className="text-[11px] font-bold tracking-tight">Aa</span>
              </Button>
            </div>

            {/* Submissions Action Block Docks */}
            <div className="flex items-center gap-1.5 ml-auto">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  disabled={disabled}
                  className="h-8 text-xs font-medium rounded-lg px-2.5"
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
                  "h-8 w-8 rounded-lg transition-all duration-150 active:scale-95 shrink-0 shadow-xs",
                  isEmpty 
                    ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600 cursor-not-allowed" 
                    : "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
                )}
              >
                <SendHorizontal className="h-3.5 w-3.5 stroke-[2.2]" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Helper Hint Footer (Hidden implicitly on small layouts to match native messaging conventions) */}
        <div className="hidden sm:flex items-center justify-between mt-1 px-1 select-none text-[10px] text-neutral-400 dark:text-neutral-500 font-medium tracking-tight opacity-0 group-hover/editor:opacity-100 transition-opacity duration-300">
          <span><strong>Return</strong> to send • <strong>Shift + Return</strong> for new line</span>
        </div>
      </div>
    </TooltipProvider>
  );
}