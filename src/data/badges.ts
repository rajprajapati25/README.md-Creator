export interface CuratedBadge {
  id: string;
  name: string;
  category: "distribution" | "tools" | "social" | "platforms" | "quality";
  badgeUrl: string;
  defaultLink: string;
  logo: string;
  logoColor: string;
  badgeColor: string;
}

export const RAW_BADGES_DATA = `
![Dev.to](https://img.shields.io/badge/Dev.to-0A0A0A?logo=devdotto&logoColor=white)
![Ghost](https://img.shields.io/badge/Ghost-000?logo=ghost&logoColor=yellow)
![App Store](https://img.shields.io/badge/App_Store-0D96F6?logo=app-store&logoColor=white)	
![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-4285F4?logo=chromewebstore&logoColor=white)
![F-Droid](https://img.shields.io/badge/F--Droid-%2311AB00.svg?logo=f-droid&logoColor=white)
![Firefox Add-Ons](https://img.shields.io/badge/Firefox_Add_Ons-20123A?logo=firefoxbrowser&logoColor=white)
![Flathub](https://img.shields.io/badge/Flathub-000000?logo=flathub&logoColor=fff)
![Google Play Store](https://img.shields.io/badge/Google_Play-414141?logo=google-play&logoColor=white)	
![Snapcraft](https://img.shields.io/badge/Snapcraft-e95420?logo=snapcraft&logoColor=fff)
![Uptodown](https://custom-icon-badges.demolab.com/badge/Uptodown-FFFFFF?logo=uptodown)
`;

export const CURATED_BADGES: CuratedBadge[] = [
];
