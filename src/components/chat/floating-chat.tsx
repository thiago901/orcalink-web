"use client";

import {

  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";

import { FiMessageCircle } from "react-icons/fi";
import { Chats } from "./chats";
import { useAuthStore } from "../../stores/authStore";

export function FloatingChat() {
  const { user } = useAuthStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent >
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Chats</DrawerHeader>
              <DrawerBody className="p-0">
                {!!user && <Chats id={user.id} sender="CLIENT" />}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      
      {/* <span className="z-10 border border-solid border-white fixed bottom-[55px] right-[10px] bg-primary text-white p-1 rounded-full h-[30px] w-[30px] text-sm flex justify-center items-center" color="primary">
        <span>5</span>
      </span> */}
      
      <Button
        onPress={onOpen}
        isIconOnly
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
      >
        <FiMessageCircle size={24} />
      </Button>
    </>
  );
}
