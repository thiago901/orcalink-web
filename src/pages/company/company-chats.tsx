import { useCompanyStore } from "../../stores/companyStore";
import { Chats } from "../../components/chat/chats";

export function CompanyChatsPage() {
  const { current_company } = useCompanyStore();

  return (
    <div className="h-full">
      
        {!!current_company && (
          <Chats id={current_company.id} sender="COMPANY" />
        )}
      
    </div>
  );
}
