import React from "react";
import ActiveLink from "../active-link";
import GithubIcon from "../icons/GithubIcon";
import LinkedInIcon from "../icons/LinkedInIcon";
import TelegramIcon from "../icons/TelegramIcon";
import TwitterIcon from "../icons/TwitterIcon";

interface SocialLinksProps {
  isColored?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ isColored }) => {
  const iconClassName =
    "fill-white mr-[15px] hover:fill-[#41F092] h-[20px] w-[20px]" +
    " cursor-pointer transition-colors ";
  return (
    <div className="hidden grow flex-row items-center justify-evenly md:flex">
      <ActiveLink href="https://github.com/vself-project/vself-dao">
        <GithubIcon className={iconClassName} />
      </ActiveLink>
      {/* <ActiveLink href="https://t.me/vselfbeta">
        <TelegramIcon className={iconClassName} />
      </ActiveLink>
      <ActiveLink href="https://twitter.com/vself_meta">
        <TwitterIcon className={iconClassName} />
      </ActiveLink>
      <ActiveLink href="https://www.linkedin.com/company/vself/">
        <LinkedInIcon className={iconClassName} />
      </ActiveLink> */}
    </div>
  );
};

export default SocialLinks;
