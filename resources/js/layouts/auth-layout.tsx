//import MessageBox from '@/components/message-box';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            { /*
            <MessageBox />
            */ }
            <main className='p-2'>
            {children}
            </main>
        </AuthLayoutTemplate>
    );
}
