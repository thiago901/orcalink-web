import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { MdNotificationsNone } from "react-icons/md";
import { Text } from "./ui/Text";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { GoDotFill } from "react-icons/go";
import { useCallback, useEffect, useMemo } from "react";
import { useSocketStore } from "../stores/useSocketStore";
import { useAuthStore } from "../stores/authStore";

import * as notificationAPI from "../api/notification";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type NotificationMessageProps = {
  id: string;
  message: {
    title: string;
    text: string;
    estimate_request_id: string;
  };
  read: boolean;
  recipient_id: string;
};
type NotificationType = "PROPOSAL" | "PAYMENT";

interface ProposalNotification {
  estimate_request_id: string;
  title: string;
  text: string;
}

interface PaymentNotification {
  paymentId: string;
  amount: number;
}

type NotificationMap = {
  PROPOSAL: ProposalNotification;
  PAYMENT: PaymentNotification;
};

type NotificationByType<T extends NotificationType> = NotificationMap[T];

export function Notification() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { connect, on, off, emit } = useSocketStore();

  const { data: notifications } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const internalNotification = await notificationAPI.getByUserId(user!.id);
      return internalNotification.map((item) => ({
        id: item.id,
        message: JSON.parse(item.message) as NotificationByType<"PROPOSAL">,
        read: item.read,
        title: item.title,
        type: item.type,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
    enabled: !!user?.id,
  });

  const handleNewNotifications = useCallback(
    (notification: NotificationMessageProps) => {
      queryClient.setQueryData<NotificationMessageProps[]>(
        ["notifications", user?.id],
        (old = []) => [notification, ...old]
      );
    },
    [queryClient, user?.id]
  );
  const handleReadNotification = useCallback(async (id: string) => {
    await notificationAPI.readNotification(id);
    queryClient.setQueryData<NotificationMessageProps[]>(
      ["notifications", user?.id],
      (old = []) =>
        old.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, [queryClient, user?.id]);
  useEffect(() => {
    if (!user) return;

    connect();

    emit("join:room", { roomId: user.id });

    on("room:joined", () => {
      console.log("Entrou na sala do usuario");
    });
    on("proposal:sent", handleNewNotifications);

    return () => {
      off("proposal:sent", handleNewNotifications);
    };
  }, [user, connect, emit, on, off, handleNewNotifications]);

  const notificationUnread = useMemo(() => {
    return notifications?.reduce((acc, cur) => acc + (!cur.read ? 1 : 0), 0);
  }, [notifications]);
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button color="secondary" isIconOnly variant="light">
          <Badge
            color="primary"
            content={notificationUnread}
            size="sm"
            shape="rectangle"
            isInvisible={!notificationUnread}
          >
            <MdNotificationsNone size={20} />
          </Badge>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notificações"
        variant="flat"
        className="w-80 max-h-96 overflow-y-auto"
        items={notifications}
      >
        {(item) => (
          <DropdownItem
            key={item.id}
            href={`my-budgets/${item.message.estimate_request_id}`}
            onPress={() => handleReadNotification(item.id)}
            textValue="Notificattion"
          >
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <HiOutlineDocumentText />
                  <Text type="normal">{item.message.title}</Text>
                </div>
                <Text type="small" color="muted">
                  {item.message.text}
                </Text>
              </div>
              {!item.read && <GoDotFill />}
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
