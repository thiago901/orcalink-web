import { ChangeEvent, useRef, useState } from 'react';
import { Upload, X, FileText, AlertCircle, Car } from 'lucide-react';

import { Button, Card, CardBody } from '@heroui/react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  accept?: string;
  error?: string;
}

const FileUpload = ({
  onFilesSelected,
  maxFiles = 5,
  maxSizeInMB = 10,
  accept = '*',
  error,
}: FileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
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

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
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
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

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

      {error && (
        <div className="flex items-center gap-2 text-error-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <>
          {selectedFiles.map((file, index) => (
           <Card>
              <CardBody
                key={`${file.name}-${index}`}
                
              >
                <div className='flex'>
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
                    onPress={() => removeFile(index)}
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