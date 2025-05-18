import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Button, Card, CardBody } from '@heroui/react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  accept?: string;
  error?: string;
  multiple?: boolean;
}

const FileUpload = ({
  onFilesSelected,
  maxFiles = 5,
  maxSizeInMB = 10,
  accept = '*',
  error,
  multiple = true,
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSizeInBytes) {
        console.error(`File ${file.name} is too large`);
        return false;
      }
      return true;
    });

    if (validFiles.length + selectedFiles.length > maxFiles) {
      console.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = multiple ? [...selectedFiles, ...validFiles] : [validFiles[0]];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);

    if (!multiple && validFiles[0]) {
      const url = URL.createObjectURL(validFiles[0]);
      setPreviewUrl(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = () => {
    setSelectedFiles([]);
    setPreviewUrl(null);
    onFilesSelected([]);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {multiple ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-300 hover:border-primary-500'
          } ${error ? 'border-error-500' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-12 h-12 text-neutral-400 mb-4" />
            <p className="text-neutral-600 mb-2">
              Arraste arquivos aqui ou{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                escolha do computador
              </button>
            </p>
            <p className="text-sm text-neutral-500">
              Máximo de {maxFiles} arquivos. Até {maxSizeInMB}MB cada.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {previewUrl ? (
            <div className="relative w-32 h-32">
              <img
                src={previewUrl}
                alt="preview"
                className="rounded-full object-cover w-full h-full cursor-pointer border border-neutral-300"
                onClick={openFileDialog}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onPress={removeFile}
                isIconOnly
                className="absolute -top-2 -right-2 bg-white shadow-md"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFileDialog}
              className="w-32 h-32 flex items-center justify-center rounded-full border-2 border-dashed text-neutral-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <Upload className="w-8 h-8" />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-error-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {multiple && selectedFiles.length > 0 && (
        <>
          {selectedFiles.map((file, index) => (
            <Card key={`${file.name}-${index}`}>
              <CardBody>
                <div className="flex">
                  <div className="flex flex-1 items-center gap-3">
                    <FileText className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onPress={() =>
                      setSelectedFiles(prev => {
                        const newFiles = prev.filter((_, i) => i !== index);
                        onFilesSelected(newFiles);
                        return newFiles;
                      })
                    }
                    isIconOnly
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default FileUpload;
