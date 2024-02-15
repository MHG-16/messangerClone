"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

import { User } from "@prisma/client";

import Modal from "../Modal";
import Input from "../input";
import Button from "../button";


interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
}
const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser
}) => {
    const router = useRouter(); 
    const [ isPending, startTransition ] = useTransition();

    const { 
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        },
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    });

    const image = watch("image");

    const handleUpload = (result: any) => {
        setValue("image", result?.info?.secure_url, {
            shouldValidate: true
        })
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        startTransition(() => {
            axios.post("/api/settings", data)
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error("Something went wrong"));
        })
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Profile
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Edit your public information
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input disabled={isPending} label="Name" id="name" errors={errors} required register={register}/>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <Image 
                                        width="48" 
                                        height="48" 
                                        className="rounded-full" 
                                        alt="Avatar"
                                        src={image || currentUser?.image || "/images/placeholder.jpg"}
                                    />
                                    <CldUploadButton
                                        options={{ maxFiles: 1 }}
                                        onUpload={handleUpload}
                                        uploadPreset="i9rmsosg"
                                    >
                                        <Button disabled={isPending} secondary type="button">
                                            Change
                                        </Button>
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                            <Button disabled={isPending} secondary onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                Save
                            </Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default SettingsModal;