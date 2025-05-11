import Select, {
  Props as ReactSelectProps,
  GroupBase,
  SingleValue,
  MultiValue,
} from "react-select";
import AsyncSelect from "react-select/async";

// Define generic option type with value and label
export interface OptionType {
  value: any;
  label: string;
}

type SelectInputProps<Option, IsMulti extends boolean = false> =
  Omit<ReactSelectProps<Option, IsMulti, GroupBase<Option>>, 'defaultOptions'> & {
    className?: string;
    isAsync?: boolean;
    loadOptions?: (inputValue: string) => Promise<Option[]>;
    cacheOptions?: boolean;
    defaultOptions?: boolean | readonly Option[];
  };

export function SelectInput<Option = OptionType, IsMulti extends boolean = false>(
  props: SelectInputProps<Option, IsMulti>
) {
  const {
    isAsync = false,
    loadOptions,
    cacheOptions = false,
    ...restProps
  } = props;

  const theme = (rsTheme: any) => ({
    ...rsTheme,
    colors: {
      ...rsTheme.colors,
      primary: "var(--primary)",
      primary25: "var(--primary-foreground)",
      neutral0: "var(--background)",
      neutral80: "var(--foreground)",
      neutral20: "var(--border)",
    },
  });

  if (isAsync && loadOptions) {
    return (
      <AsyncSelect<Option, IsMulti>
        {...restProps}
        loadOptions={loadOptions}
        cacheOptions={cacheOptions}
        theme={theme}
      />
    );
  }

  return (
    <Select<Option, IsMulti>
      {...restProps}
      theme={theme}
    />
  );
}
