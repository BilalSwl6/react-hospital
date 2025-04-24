<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelExportService
{
    public function export($data, $headers, $fileName = 'export.xlsx')
    {
        // Create a new Spreadsheet object
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set the headers
        foreach ($headers as $key => $header) {
            $column = chr(65 + $key); // Convert 0-based index to column letter (A, B, C, etc.)
            $sheet->setCellValue($column . '1', $header);

            // Make the header bold
            $sheet->getStyle($column . '1')->getFont()->setBold(true);

            // Auto-size the columns
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Add data to the spreadsheet
        $row = 2; // Start at the second row (below headers)
        foreach ($data as $rowData) {
            // Ensure rowData keys are numeric using array_values
            $rowData = array_values($rowData); // Reset the array keys to numeric

            foreach ($rowData as $key => $value) {
                $column = chr(65 + $key); // Convert 0-based index to column letter (A, B, C, etc.)
                $sheet->setCellValue($column . $row, $value);

                // Enable text wrapping
                $sheet->getStyle($column . $row)->getAlignment()->setWrapText(true);
            }
            $row++;
        }

        // Write the file to a temporary location
        $writer = new Xlsx($spreadsheet);
        $temp_file = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($temp_file);

        // Return the path to the temporary file
        return $temp_file;
    }

    public function exportMultipleSheets($sheetsData, $fileName = 'export.xlsx')
    {
        // Create a new Spreadsheet object
        $spreadsheet = new Spreadsheet();

        foreach ($sheetsData as $index => $sheetData) {
            if ($index > 0) {
                $spreadsheet->createSheet();
            }
            $sheet = $spreadsheet->setActiveSheetIndex($index);
            $sheet->setTitle($sheetData['title']);

            // Set the headers
            foreach ($sheetData['headers'] as $key => $header) {
                $column = chr(65 + $key); // Convert 0-based index to column letter (A, B, C, etc.)
                $sheet->setCellValue($column . '1', $header);

                // Make the header bold
                $sheet->getStyle($column . '1')->getFont()->setBold(true);

                // Auto-size the columns
                $sheet->getColumnDimension($column)->setAutoSize(true);
            }

            // Add data to the spreadsheet
            $row = 2; // Start at the second row (below headers)
            foreach ($sheetData['data'] as $rowData) {
                // Ensure rowData keys are numeric using array_values
                $rowData = array_values($rowData); // Reset the array keys to numeric

                foreach ($rowData as $key => $value) {
                    $column = chr(65 + $key); // Convert 0-based index to column letter (A, B, C, etc.)
                    $sheet->setCellValue($column . $row, $value);
                }
                $row++;
            }
        }

        // Write the file to a temporary location
        $writer = new Xlsx($spreadsheet);
        $temp_file = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($temp_file);

        // Return the path to the temporary file
        return $temp_file;
    }
}

