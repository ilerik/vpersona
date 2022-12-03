/* eslint-disable @next/next/no-img-element */
import React from "react";

interface DropdownMenuProps {
  isOpened: boolean;
  handleSignOut: () => void;
  accountId: string | null;
}

export enum MenuType {
  Main = "MainMenu",
  Submenu = "Submenu",
  Settings = "SettingsMenu",
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpened,
  handleSignOut,
  accountId,
}) => {
  if (!isOpened) return null;

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col items-start p-[20px] sm:items-end">
      <p className="mb-[10px] font-interBold">{accountId}</p>
      <button
        type="button"
        onClick={handleSignOut}
        className=" rounded-full hover:bg-transparent hover:text-[#41F092] sm:inline-block"
      >
        Sign Out
      </button>
    </div>
  );
};

export default DropdownMenu;
