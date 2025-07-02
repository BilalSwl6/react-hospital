import { Info, HelpCircle, PlusCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const ShortcutsPage = () => {
  // Sample shortcuts data
  const shortcuts = [
    { key: '⌘ B', description: 'Toggle sidebar', icon: <HelpCircle className="h-4 w-4" /> },
    { key: 'Esc', description: 'Close modal or dialog', icon: <Info className="h-4 w-4" /> },
    { key: 'Shift + N', description: 'Create new field while doing expense', icon: <PlusCircle className="h-4 w-4" /> }
  ];

  return (
        <AppLayout breadcrumbs={[{ title: 'Shortcuts', href: '/shortcuts' }]}>
            <Head title="Shortcuts" />
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Keyboard Shortcuts</h1>
          <p className="text-slate-500 dark:text-slate-400">Become more productive with these shortcuts</p>
        </div>

                { /*
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <AlertTitle className="text-slate-900 dark:text-slate-100">Pro tip</AlertTitle>
          <AlertDescription className="text-slate-700 dark:text-slate-300">
            Press <kbd className="px-2 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200">⌘ /</kbd> anytime to show this shortcuts panel.
          </AlertDescription>
        </Alert>
        */}

        <div className="rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">Available Shortcuts</h2>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      {shortcut.icon}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{shortcut.description}</span>
                  </div>
                  <kbd className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-sm font-mono text-slate-700 dark:text-slate-300">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't see what you're looking for? <a href="mailto:mbilal2913@gmail.com" className="text-blue-500 dark:text-blue-400 hover:underline">Request a new shortcut</a>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default ShortcutsPage;
