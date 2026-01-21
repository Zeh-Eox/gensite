import React from "react";
import {
  AccountSettingsCards,
  ChangePasswordCard,
  DeleteAccountCard,
} from "@daveyplate/better-auth-ui";

const Settings: React.FC = () => {
  return (
    <div className="w-full p-4 flex flex-col justify-center items-center min-h-[90vh] gap-6 py-12">
      <AccountSettingsCards
        classNames={{
          card: {
            base: "bg-black/10 max-w-xl mx-auto",
            footer: "bg-black/10",
          },
        }}
      />

      <div className="w-full">
        <ChangePasswordCard
          classNames={{
            base: "bg-black/10 max-w-xl mx-auto",
            footer: "bg-black/10",
          }}
        />
      </div>

      <div className="w-full">
        <DeleteAccountCard
          classNames={{
            base: "bg-black/10 max-w-xl mx-auto",
          }}
        />
      </div>
    </div>
  );
};

export default Settings;
