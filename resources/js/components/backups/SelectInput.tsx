import Select, {
    Props as ReactSelectProps,
    GroupBase,
} from "react-select";

export function SelectInput<Option, IsMulti extends boolean = false>(
    props: ReactSelectProps<Option, IsMulti> & {
        className?: string;
    }
) {
    // 1) Theme override stays the same…
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

    // 2) classNames stays the same…
    const classNames = {
        control: ({ isFocused }: { isFocused: boolean }) =>
            [
                "bg-background text-foreground border rounded-md shadow-sm",
                isFocused ? "border-primary" : "border-border",
            ].join(" "),
        menu: () => "bg-background border border-border rounded-md mt-1 shadow-lg",
        option: ({ isFocused, isSelected }: any) =>
            [
                "px-3 py-2 cursor-pointer",
                isFocused && "bg-primary-25",
                isSelected && "bg-primary/10",
            ]
            .filter(Boolean)
            .join(" "),
        // …other slots…
    };

    // 3) New: add menuPortal styles so it rises above any overflow:hidden parent
    const portalStyles = {
        menuPortal: (base: any) => ({
            ...base,
            zIndex: 9999,              // ensure on top 2
        }),
        control: (base: any) => ({
            ...base,
            boxShadow: "none",
            transition: "none",
        }),
    };

    return (
        <>
            <Select
                {...props}
                theme={theme}
            />
        </>
    );
}
