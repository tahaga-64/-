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
      <label className="block border border-dashed border-tax-orange/60 rounded bg-tax-orange-light p-5 text-center cursor-pointer hover:border-tax-orange transition-colors mb-2">
        <span className="text-2xl block mb-1.5">📸</span>
        <span className="text-sm text-tax-orange font-medium">
          {selectedFile ? selectedFile.name : 'タップして撮影 / 写真を選択'}
        </span>
        <p className="text-xs text-tax-orange/70 mt-1">書類を近づけて撮影してください</p>
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
      className={`border border-dashed rounded p-5 text-center cursor-pointer transition-colors mb-2 ${
        isDragActive
          ? 'border-tax-orange bg-tax-orange-light'
          : 'border-tax-rule bg-paper-light hover:border-tax-orange/60'
      }`}
    >
      <input {...getInputProps()} />
      <span className="text-2xl block mb-1.5">📄</span>
      {selectedFile ? (
        <p className="text-sm text-tax-orange font-medium">{selectedFile.name}</p>
      ) : (
        <p className="text-sm text-tax-ink/60">
          PDFや画像をドラッグ＆ドロップ
          <br />
          <span className="text-xs">または タップして選択（最大4MB）</span>
        </p>
      )}
    </div>
  )
}
