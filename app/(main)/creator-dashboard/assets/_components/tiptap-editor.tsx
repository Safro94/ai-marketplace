'use client'

import { Button } from '@/components/ui/button'
import { HardBreak } from '@tiptap/extension-hard-break'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
  Unlink,
} from 'lucide-react'
import { useCallback } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({
  content,
  onChange,
  placeholder,
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4',
          },
        },
        hardBreak: {
          HTMLAttributes: {
            class: 'block',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-2',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-2 border-gray-300 pl-4 italic text-gray-600',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      HardBreak.configure({
        HTMLAttributes: {
          class: 'block mb-2',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 [&_p]:mb-4 [&_br]:block [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-base',
      },
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className={`border rounded-md ${className}`}>
      {/* Toolbar */}
      <div className='border-b p-2 flex flex-wrap gap-1'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className='h-4 w-4' />
        </Button>
        <div className='w-px h-6 bg-border mx-1' />

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <LinkIcon className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          <Unlink className='h-4 w-4' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className='h-4 w-4' />
        </Button>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className='h-4 w-4' />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className='min-h-[200px]'
        placeholder={placeholder}
      />
    </div>
  )
}
