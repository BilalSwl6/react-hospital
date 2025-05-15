<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Export Medicine Records</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
    <style>
        :root {
            --primary: #10B981;
            --primary-dark: #059669;
            --bg-light: #F9FAFB;
            --bg-dark: #1F2937;
            --text-light: #374151;
            --text-dark: #E5E7EB;
            --card-light: #FFFFFF;
            --card-dark: #1F2937;
            --border-light: #D1D5DB;
            --border-dark: #4B5563;
        }

        .dark {
            --bg: var(--bg-dark);
            --text: var(--text-dark);
            --card: var(--card-dark);
            --border: var(--border-dark);
        }

        .light {
            --bg: var(--bg-light);
            --text: var(--text-light);
            --card: var(--card-light);
            --border: var(--border-light);
        }

        body {
            background-color: var(--bg-light);
            color: var(--text-light);
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .card {
            background-color: var(--card-light);
            transition: box-shadow 0.3s ease;
        }

        .btn-primary {
            background-color: var(--primary);
            transition: all 0.2s ease;
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-1px);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fade-in 0.5s ease forwards;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center px-4 py-12">

    <div class="container mx-auto px-4 fade-in">
        <div class="card shadow-lg rounded-2xl p-8 max-w-lg mx-auto">
            <h1 class="text-2xl font-bold mb-6 text-center flex items-center justify-center">
                <svg class="w-7 h-7 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                Export Medicine Records
            </h1>

            <div id="error-alert" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 hidden" role="alert">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm" id="error-message"></p>
                    </div>
                </div>
            </div>

            <div id="success-alert" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 hidden" role="alert">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm" id="success-message"></p>
                    </div>
                </div>
            </div>

            <form action="{{ route('medicines.export-to-excel') }}" method="POST" class="space-y-6">
                @csrf

                <div class="mb-6">
                    <label class="block text-sm font-medium mb-2">Medicine Status</label>
                    <div class="flex items-center space-x-6">
                        <div class="flex items-center">
                            <input type="radio" name="status" value="all" id="all" class="h-4 w-4 text-green-500 focus:ring-green-400" checked>
                            <label for="all" class="ml-2 text-sm">All</label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" name="status" value="active" id="active" class="h-4 w-4 text-green-500 focus:ring-green-400">
                            <label for="active" class="ml-2 text-sm">Active</label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" name="status" value="inactive" id="inactive" class="h-4 w-4 text-green-500 focus:ring-green-400">
                            <label for="inactive" class="ml-2 text-sm">Inactive</label>
                        </div>
                    </div>
                </div>

                <div class="flex items-center mb-6">
                    <input type="checkbox" name="excludeZero" id="excludeZero" value="true" class="h-4 w-4 text-green-500 focus:ring-green-400">
                    <label for="excludeZero" class="ml-2 text-sm">Exclude medicines with zero quantity</label>
                </div>

                <div class="flex justify-center pt-4">
                    <button type="submit" class="btn-primary w-full sm:w-auto px-6 py-3 text-white font-medium rounded-lg shadow-md flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Export to Excel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Get URL parameters to display any success/error messages
            const urlParams = new URLSearchParams(window.location.search);
            const errorMsg = urlParams.get('error');
            const successMsg = urlParams.get('success');

            if (errorMsg) {
                const errorAlert = document.getElementById('error-alert');
                document.getElementById('error-message').textContent = errorMsg;
                errorAlert.classList.remove('hidden');
            }

            if (successMsg) {
                const successAlert = document.getElementById('success-alert');
                document.getElementById('success-message').textContent = successMsg;
                successAlert.classList.remove('hidden');
            }
        });
    </script>
</body>
</html>
