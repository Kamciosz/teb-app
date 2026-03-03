import { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ChatWindow } from '../../components/chat/ChatWindow';

export default function ChatPage() {
  const { currentGroupId, selectGroup, fetchGroups } = useChatStore();

  useEffect(() => {
    fetchGroups();
    // Auto-select first group for now if none selected
    // In real app, user selects from list
    // selectGroup('some-group-id');
  }, [fetchGroups, selectGroup]);

  if (!currentGroupId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Wybierz czat z listy (Lista w budowie)
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)]"> {/* Adjust height based on layout */}
      <ChatWindow />
    </div>
  );
}
