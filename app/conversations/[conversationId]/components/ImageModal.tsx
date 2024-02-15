"use client";

import Modal from "@/components/Modal";
import Image from "next/image";
import React from "react";

interface ImageModalProps {
    src?: string | null;
    onClose: () => void;
    isOpen: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    src
}) => {
  if (!src) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}> 
        <div className="w-80 h-80">
            <Image alt="image message"
                className="object-cover"
                fill
                src={src}
            />
        </div>
    </Modal>
  )
}

export default ImageModal