import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const languages = [
  { name: "British English", code: "en-GB" },
  { name: "China Chinese", code: "zh-CN" },
];

function SelectLanguage({ handleSelectLanguage, className }) {
  return (
    <Select onValueChange={handleSelectLanguage}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((language) => {
            return (
              <SelectItem key={language.code} value={language.code}>
                {language.name}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectLanguage;
