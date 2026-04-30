'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type Props = {
  mode: 'photo' | 'scan'
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

const MAX_SIZE = 4 * 1024 * 1024

export default function FileUploader({ mode, onFileSelect, selectedFile }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFileSelect(accepted[0])
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: mode === 'photo',
  })

  if (mode === 'photo') {
    return (
      <label className="block border-2 border-dashed border-blue-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors mb-2">
        <span className="text-3xl block mb-2">📸</span>
        <span className="text-sm text-blue-600 font-medium">
          {selectedFile ? selectedFile.name : 'タップして撮影 / 写真を選択'}
        </span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
        />
      </label>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-2 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <input {...getInputProps()} />
      <span className="text-3xl block mb-2">📄</span>
      {selectedFile ? (
        <p className="text-sm text-blue-600 font-medium">{selectedFile.name}</p>
      ) : (
        <p className="text-sm text-gray-500">
          PDFや画像をドラッグ＆ドロップ
          <br />
          <span className="text-xs">または タップして選択（最大4MB）</span>
        </p>
      )}
    </div>
  )
}
