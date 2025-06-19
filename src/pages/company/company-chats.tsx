

import { useCompanyStore } from "../../stores/companyStore";
import { Chats } from "../../components/chat/chats";



export function CompanyChatsPage() {
  const { current_company } = useCompanyStore();
  

 

  return (
    <div>
      <div className="space-y-6">
      {!!current_company && <Chats id={current_company.id} sender="COMPANY" />}
      </div>
    </div>
  );
}
