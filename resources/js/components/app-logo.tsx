import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function AppLogo() {
    const { site_name, site_logo } = usePage<SharedData>().props.settings;
    const data = usePage<SharedData>().props;
    console.log(data)
    return (
        <>
            <div className="dark:bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <img src={site_logo ? `/storage/${site_logo}` : '/logo.png'} alt="Logo" className="size-7 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold" title={site_name}>{site_name}</span>
            </div>
        </>
    );
}
