<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Export Expense Records</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
    <style>
        :root {
            --primary: #10B981;
            --primary-dark: #059669;
            --bg-light: #F9FAFB;
            --bg-dark: #111827;
            --text-light: #374151;
            --text-dark: #E5E7EB;
            --card-light: #FFFFFF;
            --card-dark: #1F2937;
            --input-light: #FFFFFF;
            --input-dark: #374151;
            --border-light: #D1D5DB;
            --border-dark: #4B5563;
        }

        .dark {
            --primary: #10B981;
            --primary-dark: #059669;
            --bg: var(--bg-dark);
            --text: var(--text-dark);
            --card: var(--card-dark);
            --input: var(--input-dark);
            --border: var(--border-dark);
        }

        .light {
            --bg: var(--bg-light);
            --text: var(--text-light);
            --card: var(--card-light);
            --input: var(--input-light);
            --border: var(--border-light);
        }

        body {
            background-color: var(--bg);
            color: var(--text);
            transition: background-color 0.3s ease, color 0.3s ease;
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .card {
            background-color: var(--card);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        input, select {
            background-color: var(--input);
            border-color: var(--border);
            color: var(--text);
            transition: all 0.2s ease;
        }

        input:focus, select:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
            outline: none;
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

        .form-group {
            position: relative;
            margin-bottom: 1.5rem;
        }

        .form-label {
            position: absolute;
            left: 0.75rem;
            top: 0.75rem;
            transition: all 0.2s ease;
            pointer-events: none;
            color: var(--text);
            opacity: 0.7;
            background-color: transparent;
            padding: 0 0.25rem;
        }

        /* Float label when input has value or is focused */
        .form-input:focus ~ .form-label,
        .form-input:not(:placeholder-shown) ~ .form-label,
        /* Float label when select is focused or valid */
        .form-select:focus ~ .form-label,
        .form-select:valid ~ .form-label {
            top: -0.5rem;
            left: 0.5rem;
            font-size: 0.75rem;
            background-color: var(--card);
            font-weight: 600;
            color: var(--primary);
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
<body class="light min-h-screen flex items-center justify-center px-4 py-10">

    <div class="container mx-auto px-4 py-10 fade-in">
        <div class="card shadow-lg rounded-2xl p-8 md:p-10 max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-center flex items-center justify-center">
                <svg class="w-8 h-8 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Export Expense Records
            </h1>

            <div id="error-alert" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 hidden" role="alert">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm">{{ session('error') }}</p>
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
                        <p class="text-sm">{{ session('success') }}</p>
                    </div>
                </div>
            </div>

            <form action="{{ route('expense.export-to-excel') }}" method="POST" class="space-y-6">
                @csrf
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <input type="date" name="start_date" id="start_date" class="form-input w-full border rounded-lg px-4 py-3 focus:ring focus:ring-green-200 transition-all" placeholder=" " required>
                        <label for="start_date" class="form-label">Start Date</label>
                    </div>

                    <div class="form-group">
                        <input type="date" name="end_date" id="end_date" class="form-input w-full border rounded-lg px-4 py-3 focus:ring focus:ring-green-200 transition-all" placeholder=" " required>
                        <label for="end_date" class="form-label">End Date</label>
                    </div>

                    <div class="form-group md:col-span-2">
                        <select name="ward_id" id="ward_id" class="form-select w-full border rounded-lg px-4 py-3 focus:ring focus:ring-green-200 transition-all appearance-none" required>
                            <option value="" disabled hidden>Select a ward</option>
                            <option value="all" selected>All Wards</option>
                             @foreach ($wards as $ward)
                                <option value="{{ $ward->id }}">{{ $ward->ward_name }}</option>
                            @endforeach
                        </select>
                        <label for="ward_id" class="form-label">Ward</label>
                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button type="submit" class="btn-primary px-6 py-3 text-white font-medium rounded-lg shadow-md flex items-center">
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
            const hasError = false;
            const hasSuccess = false;

            if (hasError) document.getElementById('error-alert').classList.remove('hidden');
            if (hasSuccess) document.getElementById('success-alert').classList.remove('hidden');

            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            document.getElementById('start_date').valueAsDate = firstDayOfMonth;
            document.getElementById('end_date').valueAsDate = today;
        });
    </script>
</body>
</html>

